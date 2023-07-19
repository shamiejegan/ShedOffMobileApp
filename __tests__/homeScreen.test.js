import React from 'react';
import { render } from '@testing-library/react-native';

import HomeScreen from '../scripts/homeScreen';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));

describe('HomeScreen', () => {

    it('default', () => {
        const inst= render(<HomeScreen navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

