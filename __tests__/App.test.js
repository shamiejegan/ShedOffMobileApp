import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';

describe('App', () => {

    it('App entry', () => {
      const inst= render(<App/>).toJSON();
      expect(inst).toMatchSnapshot();
    });
  
});

