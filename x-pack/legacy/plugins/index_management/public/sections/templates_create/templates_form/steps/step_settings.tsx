/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiButtonEmpty,
  EuiSpacer,
  EuiDescribedFormGroup,
  EuiFormRow,
  EuiText,
  EuiCodeEditor,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

export const StepSettings: React.FunctionComponent = ({}) => {
  return (
    <div>
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiTitle>
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templatesForm.stepSettings.stepTitle"
                defaultMessage="Settings (optional)"
              />
            </h3>
          </EuiTitle>

          <EuiSpacer size="s" />

          <EuiText>
            <p>
              <FormattedMessage
                id="xpack.idxMgmt.templatesForm.stepSettings.settingsDescription"
                defaultMessage="Define index settings that will be applied to a new index."
              />
            </p>
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          {/** TODO add href: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-templates.html */}
          <EuiButtonEmpty size="s" flush="right" href={''} target="_blank" iconType="help">
            <FormattedMessage
              id="xpack.idxMgmt.templatesForm.stepSettings.docsButtonLabel"
              defaultMessage="Index Settings docs"
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="l" />

      {/* Settings code editor */}
      <EuiDescribedFormGroup
        title={
          <EuiTitle size="s">
            <h3>
              <FormattedMessage
                id="xpack.idxMgmt.templatesForm.stepSettings.settingsTitle"
                defaultMessage="Index settings"
              />
            </h3>
          </EuiTitle>
        }
        description={
          <FormattedMessage
            id="xpack.idxMgmt.templatesForm.stepSettings.indexSettingsDescription"
            defaultMessage="Settings to be applied to new indices."
          />
        }
        idAria="stepSettingsIndexSettingsDescription"
        fullWidth
      >
        <EuiFormRow
          label={
            <FormattedMessage
              id="xpack.idxMgmt.templatesForm.stepSettings.fieldIndexSettingsLabel"
              defaultMessage="Index settings"
            />
          }
          fullWidth
        >
          <EuiCodeEditor
            mode="json"
            theme="textmate"
            width="100%"
            setOptions={{
              showLineNumbers: false,
              tabSize: 2,
              maxLines: Infinity,
            }}
            editorProps={{
              $blockScrolling: Infinity,
            }}
            showGutter={false}
            minLines={6}
            aria-label={
              <FormattedMessage
                id="xpack.idxMgmt.templatesForm.stepSettings.fieldIndexSettingsAriaLabel"
                defaultMessage="Index settings editor"
              />
            }
            onChange={(value: string) => {
              // todo implement
            }}
            data-test-subj="settingsEditor"
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </div>
  );
};
