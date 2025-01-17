/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiPanel } from '@elastic/eui';
import { EuiLink } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React, { useEffect } from 'react';
import { toastNotifications } from 'ui/notify';
import url from 'url';
import { useFetcher } from '../../../hooks/useFetcher';
import { loadServiceList } from '../../../services/rest/apm/services';
import { NoServicesMessage } from './NoServicesMessage';
import { ServiceList } from './ServiceList';
import { useUrlParams } from '../../../hooks/useUrlParams';
import { useTrackPageview } from '../../../../../infra/public';
import { useCore } from '../../../hooks/useCore';

const initalData = {
  items: [],
  hasHistoricalData: true,
  hasLegacyData: false
};

let hasDisplayedToast = false;

export function ServiceOverview() {
  const core = useCore();
  const {
    urlParams: { start, end },
    uiFilters
  } = useUrlParams();
  const { data = initalData, status } = useFetcher(() => {
    if (start && end) {
      return loadServiceList({ start, end, uiFilters });
    }
  }, [start, end, uiFilters]);

  useEffect(() => {
    if (data.hasLegacyData && !hasDisplayedToast) {
      hasDisplayedToast = true;
      toastNotifications.addWarning({
        title: i18n.translate('xpack.apm.serviceOverview.toastTitle', {
          defaultMessage:
            'Legacy data was detected within the selected time range'
        }),
        text: (
          <p>
            {i18n.translate('xpack.apm.serviceOverview.toastText', {
              defaultMessage:
                "You're running Elastic Stack 7.0+ and we've detected incompatible data from a previous 6.x version. If you want to view this data in APM, you should migrate it. See more in "
            })}

            <EuiLink
              href={url.format({
                pathname: core.http.basePath.prepend('/app/kibana'),
                hash: '/management/elasticsearch/upgrade_assistant'
              })}
            >
              {i18n.translate(
                'xpack.apm.serviceOverview.upgradeAssistantLink',
                {
                  defaultMessage: 'the upgrade assistant'
                }
              )}
            </EuiLink>
          </p>
        )
      });
    }
  }, [data.hasLegacyData, core.http.basePath]);

  useTrackPageview({ app: 'apm', path: 'services_overview' });
  useTrackPageview({ app: 'apm', path: 'services_overview', delay: 15000 });

  return (
    <EuiPanel>
      <ServiceList
        items={data.items}
        noItemsMessage={
          <NoServicesMessage
            historicalDataFound={data.hasHistoricalData}
            isLoading={status === 'loading'}
          />
        }
      />
    </EuiPanel>
  );
}
