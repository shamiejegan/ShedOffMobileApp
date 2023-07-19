import React from 'react';
import { render } from '@testing-library/react-native';

import ProfileScreen from '../scripts/profileScreen';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));
    
describe('ProfileScreen', () => {

    it('default', () => {
        const inst= render(<ProfileScreen navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

