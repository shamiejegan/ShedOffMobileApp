import React from 'react';
import renderer from 'react-test-renderer';

import ToggleTwoButtons from '../../scripts/components/toggleTwoButtons';

describe("<ToggleTwoButtons/>", () =>{

  it('default', async () => {
    const inst = renderer.create(<ToggleTwoButtons/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

  it('button 1 condition true', async () => {
    const inst = renderer.create(<ToggleTwoButtons button1Condition={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

  it('button 2 condition true', async () => {
    const inst = renderer.create(<ToggleTwoButtons button2Condition={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

})
  