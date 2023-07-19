import React from 'react';
import { render } from '@testing-library/react-native';

import GoalScreen from '../scripts/goalScreen';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));

describe('Goal Screen', () => {

    it('default', () => {
        const inst= render(<GoalScreen navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

