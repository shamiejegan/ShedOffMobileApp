import React from 'react';
import renderer from 'react-test-renderer';

import ToggleThreeButtons from '../../scripts/components/toggleThreeButtons';

describe("<ToggleThreeButtons/>", () =>{

  it('<ToggleThreeButtons/>', async () => {
    const inst = renderer.create(<ToggleThreeButtons/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

  it('button 1 condition true', async () => {
    const inst = renderer.create(<ToggleThreeButtons button1Condition={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

  it('button 2 condition true', async () => {
    const inst = renderer.create(<ToggleThreeButtons button2Condition={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

  it('button 3 condition true', async () => {
    const inst = renderer.create(<ToggleThreeButtons button3Condition={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    

})
  