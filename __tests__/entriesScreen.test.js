import React from 'react';
import { render } from '@testing-library/react-native';

import EntriesScreen from '../scripts/entriesScreen';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));

describe('Entries Screen', () => {

    it('default', () => {
        const inst= render(<EntriesScreen navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

