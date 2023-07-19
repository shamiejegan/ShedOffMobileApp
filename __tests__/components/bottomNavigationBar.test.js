import React from 'react';
import renderer from 'react-test-renderer';

import BottomNavigationBar from '../../scripts/components/bottomNavigationBar';

describe("<BottomNavigationBar/>", () =>{

  it('default', async () => {
    const tree = renderer.create(<BottomNavigationBar/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on home', async () => {
    const tree = renderer.create(<BottomNavigationBar currentPage="Home"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on profile', async () => {
    const tree = renderer.create(<BottomNavigationBar currentPage="Profile"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('on entries', async () => {
    const tree = renderer.create(<BottomNavigationBar currentPage="Entries"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

  it('<on goals', async () => {
    const tree = renderer.create(<BottomNavigationBar currentPage="Goals"/>).toJSON();
    await expect(tree).toMatchSnapshot();
  });    

})
  