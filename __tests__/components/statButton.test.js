import React from 'react';
import renderer from 'react-test-renderer';

import StatButton from '../../scripts/components/statButton';

describe("<StatButton/>", () =>{

  it('<StatButton/> do not show', async () => {
    const inst = renderer.create(<StatButton toShow={0}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });  

  it('<StatButton/> to show but entry and meet goal false ', async () => {
    const inst = renderer.create(<StatButton toShow={1} entry={false} entryMeetsGoal={false}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });     

  it('<StatButton/> to show with entry but meet goal false ', async () => {
    const inst = renderer.create(<StatButton toShow={1} entry={10} entryMeetsGoal={false}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });     

  it('<StatButton/> to show with entry and meet goal true ', async () => {
    const inst = renderer.create(<StatButton toShow={1} entry={10} entryMeetsGoal={true}/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });     

})
  