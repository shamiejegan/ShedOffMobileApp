import React from 'react';
import { render } from '@testing-library/react-native';

import Welcome from '../../scripts/onboarding/welcome';

describe('Welcome', () => {

    it('default', () => {
        const inst= render(<Welcome/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

