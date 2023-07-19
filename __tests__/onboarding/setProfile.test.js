import React from 'react';
import { render } from '@testing-library/react-native';

import SetProfile from '../../scripts/onboarding/setProfile';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));
  
describe('Set Profile', () => {

    it('default', () => {
        const inst= render(<SetProfile navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
      });

});

