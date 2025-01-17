/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { KibanaFunctionalTestDefaultProviders } from '../../../types/providers';

// eslint-disable-next-line import/no-default-export
export default ({ getPageObjects, getService }: KibanaFunctionalTestDefaultProviders) => {
  const pageObjects = getPageObjects(['common', 'licenseManagement']);
  const log = getService('log');

  describe('Home page', function() {
    before(async () => {
      await pageObjects.common.navigateToApp('licenseManagement');
    });

    it('Loads the app', async () => {
      await log.debug('Checking for license header.');
      const licenseText = await pageObjects.licenseManagement.licenseText();
      expect(licenseText).to.be('Your Trial license is active');
    });

    // THIS TEST NEEDS TO BE LAST. IT IS DESTRUCTIVE! IT REMOVES TRIAL LICENSE!!!
    it('Reverts license to basic', async () => {
      await pageObjects.licenseManagement.revertLicenseToBasic();
      const licenseText = await pageObjects.licenseManagement.licenseText();
      expect(licenseText).to.be('Your Basic license is active');
    });
  });
};
