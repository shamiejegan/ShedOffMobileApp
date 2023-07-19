import React from 'react';
import renderer from 'react-test-renderer';

import OnboardingStepIndicator from '../../scripts/components/onboardingStepIndicator';

describe("<OnboardingStepIndicator/>", () =>{

  it('default', async () => {
    const tree = renderer.create(<OnboardingStepIndicator/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on step0', async () => {
    const tree = renderer.create(<OnboardingStepIndicator step1="pending" step2="pending" step3="pending"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on step1', async () => {
    const tree = renderer.create(<OnboardingStepIndicator step1="current" step2="pending" step3="pending"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on step2', async () => {
    const tree = renderer.create(<OnboardingStepIndicator step1="done" step2="current" step3="pending"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on step2', async () => {
    const tree = renderer.create(<OnboardingStepIndicator step1="done" step2="done" step3="current"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

})
  