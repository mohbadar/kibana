/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { Router, RouterRouteHandler } from '../../../../../server/lib/create_router';
import {
  wrapEsError,
  wrapCustomError,
} from '../../../../../server/lib/create_router/error_wrappers';
import { SnapshotDetails } from '../../../common/types';
import { Plugins } from '../../../shim';
import { deserializeSnapshotDetails, getManagedRepositoryName } from '../../lib';
import { SnapshotDetailsEs } from '../../types';

let callWithInternalUser: any;

export function registerSnapshotsRoutes(router: Router, plugins: Plugins) {
  callWithInternalUser = plugins.elasticsearch.getCluster('data').callWithInternalUser;
  router.get('snapshots', getAllHandler);
  router.get('snapshots/{repository}/{snapshot}', getOneHandler);
  router.delete('snapshots/{ids}', deleteHandler);
}

export const getAllHandler: RouterRouteHandler = async (
  req,
  callWithRequest
): Promise<{
  snapshots: SnapshotDetails[];
  errors: any[];
  repositories: string[];
  managedRepository?: string;
}> => {
  const managedRepository = await getManagedRepositoryName(callWithInternalUser);

  /*
   * TODO: For 8.0, replace the logic in this handler with one call to `GET /_snapshot/_all/_all`
   * when no repositories bug is fixed: https://github.com/elastic/elasticsearch/issues/43547
   */

  const repositoriesByName = await callWithRequest('snapshot.getRepository', {
    repository: '_all',
  });

  const repositoryNames = Object.keys(repositoriesByName);

  if (repositoryNames.length === 0) {
    return { snapshots: [], errors: [], repositories: [] };
  }

  const snapshots: SnapshotDetails[] = [];
  const errors: any = {};
  const repositories: string[] = [];

  const fetchSnapshotsForRepository = async (repository: string) => {
    try {
      // If any of these repositories 504 they will cost the request significant time.
      const {
        responses: fetchedResponses,
      }: {
        responses: Array<{
          repository: 'string';
          snapshots: SnapshotDetailsEs[];
        }>;
      } = await callWithRequest('snapshot.get', {
        repository,
        snapshot: '_all',
        ignore_unavailable: true, // Allow request to succeed even if some snapshots are unavailable.
      });

      // Decorate each snapshot with the repository with which it's associated.
      fetchedResponses.forEach(({ snapshots: fetchedSnapshots }) => {
        fetchedSnapshots.forEach(snapshot => {
          snapshots.push(deserializeSnapshotDetails(repository, snapshot, managedRepository));
        });
      });

      repositories.push(repository);
    } catch (error) {
      // These errors are commonly due to a misconfiguration in the repository or plugin errors,
      // which can result in a variety of 400, 404, and 500 errors.
      errors[repository] = error;
    }
  };

  await Promise.all(repositoryNames.map(fetchSnapshotsForRepository));

  return {
    snapshots,
    repositories,
    errors,
  };
};

export const getOneHandler: RouterRouteHandler = async (
  req,
  callWithRequest
): Promise<SnapshotDetails> => {
  const { repository, snapshot } = req.params;
  const managedRepository = await getManagedRepositoryName(callWithInternalUser);
  const {
    responses: snapshotResponses,
  }: {
    responses: Array<{
      repository: string;
      snapshots: SnapshotDetailsEs[];
      error?: any;
    }>;
  } = await callWithRequest('snapshot.get', {
    repository,
    snapshot,
  });

  if (snapshotResponses && snapshotResponses[0] && snapshotResponses[0].snapshots) {
    return deserializeSnapshotDetails(
      repository,
      snapshotResponses[0].snapshots[0],
      managedRepository
    );
  }

  // If snapshot doesn't exist, ES will return 200 with an error object, so manually throw 404 here
  throw wrapCustomError(new Error('Snapshot not found'), 404);
};

export const deleteHandler: RouterRouteHandler = async (req, callWithRequest) => {
  const { ids } = req.params;
  const snapshotIds = ids.split(',');
  const response: {
    itemsDeleted: Array<{ snapshot: string; repository: string }>;
    errors: any[];
  } = {
    itemsDeleted: [],
    errors: [],
  };

  // We intentially perform deletion requests sequentially (blocking) instead of in parallel (non-blocking)
  // because there can only be one snapshot deletion task performed at a time (ES restriction).
  for (let i = 0; i < snapshotIds.length; i++) {
    // IDs come in the format of `repository-name/snapshot-name`
    // Extract the two parts by splitting at last occurrence of `/` in case
    // repository name contains '/` (from older versions)
    const id = snapshotIds[i];
    const indexOfDivider = id.lastIndexOf('/');
    const snapshot = id.substring(indexOfDivider + 1);
    const repository = id.substring(0, indexOfDivider);
    await callWithRequest('snapshot.delete', { snapshot, repository })
      .then(() => response.itemsDeleted.push({ snapshot, repository }))
      .catch(e =>
        response.errors.push({
          id: { snapshot, repository },
          error: wrapEsError(e),
        })
      );
  }

  return response;
};
