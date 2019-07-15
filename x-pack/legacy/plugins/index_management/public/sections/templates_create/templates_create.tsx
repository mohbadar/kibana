/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormattedMessage } from '@kbn/i18n/react';
import { EuiPageBody, EuiPageContent, EuiSpacer, EuiTitle } from '@elastic/eui';
import { TemplatesForm } from './templates_form';
import { setBreadcrumbs } from '../../services/set_breadcrumbs';

export const TemplatesCreate: React.FunctionComponent<RouteComponentProps> = ({ history }) => {
  useEffect(() => {
    setBreadcrumbs('templatesCreate');
  }, []);

  return (
    <EuiPageBody>
      <EuiPageContent>
        <EuiTitle size="m">
          <h1 data-test-subj="pageTitle">
            <FormattedMessage
              id="xpack.idxMgmt.createTemplate.createTemplatePageTitle"
              defaultMessage="Create template"
            />
          </h1>
        </EuiTitle>
        <EuiSpacer size="l" />
        <TemplatesForm />
      </EuiPageContent>
    </EuiPageBody>
  );
};
