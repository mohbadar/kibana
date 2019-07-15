/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { Fragment, useState } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiSpacer,
} from '@elastic/eui';
import { TemplateSteps } from './template_steps';
import { StepAliases, StepLogistics, StepMappings, StepSettings, StepSummary } from './steps';

export const TemplatesForm: React.FunctionComponent = ({}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState<number>(0);

  const stepComponentMap: { [key: number]: React.FunctionComponent } = {
    1: StepLogistics,
    2: StepSettings,
    3: StepMappings,
    4: StepAliases,
    5: StepSummary,
  };

  const lastStep = Object.keys(stepComponentMap).length;
  const CurrentStep = stepComponentMap[currentStep];

  const updateCurrentStep = (step: number) => {
    if (maxCompletedStep < step - 1) {
      return;
    }
    setCurrentStep(step);
    setMaxCompletedStep(step - 1);
  };

  const onBack = () => {
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    setMaxCompletedStep(previousStep - 1);
  };

  const onNext = () => {
    const nextStep = currentStep + 1;
    setMaxCompletedStep(Math.max(currentStep, maxCompletedStep));
    setCurrentStep(nextStep);
  };

  return (
    <Fragment>
      <TemplateSteps
        currentStep={currentStep}
        maxCompletedStep={maxCompletedStep}
        updateCurrentStep={updateCurrentStep}
      />
      <EuiSpacer size="l" />
      <EuiForm>
        <CurrentStep />
        <EuiSpacer size="l" />

        <EuiFlexGroup>
          {currentStep > 1 ? (
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType="arrowLeft" onClick={() => onBack()}>
                <FormattedMessage
                  id="xpack.idxMgmt.templatesForm.backButtonLabel"
                  defaultMessage="Back"
                />
              </EuiButtonEmpty>
            </EuiFlexItem>
          ) : null}
          {currentStep < lastStep ? (
            <EuiFlexItem grow={false}>
              <EuiButton fill iconType="arrowRight" onClick={() => onNext()}>
                <FormattedMessage
                  id="xpack.idxMgmt.templatesForm.nextButtonLabel"
                  defaultMessage="Next"
                />
              </EuiButton>
            </EuiFlexItem>
          ) : null}
          {currentStep === lastStep ? (
            <EuiFlexItem grow={false}>
              <EuiButton
                fill
                color="secondary"
                iconType="check"
                onClick={() => {
                  // TODO implement
                }}
              >
                <FormattedMessage
                  id="xpack.idxMgmt.templatesForm.submitButtonLabel"
                  defaultMessage="Create template"
                />
              </EuiButton>
            </EuiFlexItem>
          ) : null}
        </EuiFlexGroup>
      </EuiForm>
      <EuiSpacer size="m" />
    </Fragment>
  );
};
