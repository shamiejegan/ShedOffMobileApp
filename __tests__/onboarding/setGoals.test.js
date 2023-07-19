import React from 'react';
import { render } from '@testing-library/react-native';

import SetGoals from '../../scripts/onboarding/setGoals';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));

describe('SetGoals', () => {

    it('setGoals.js', () => {
        const inst= render(<SetGoals navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

