import React from 'react';
import renderer from 'react-test-renderer';

import PageHeading from '../../scripts/components/pageHeading';

describe("<PageHeading/>", () =>{

  it('<PageHeading/>', async () => {
    const inst = renderer.create(<PageHeading/>).toJSON();
    await expect(inst).toMatchSnapshot();
  });    
  
})
  