import React from 'react';
import { render, fireEvent,screen} from '@testing-library/react-native';

import SignIn from '../../scripts/onboarding/signIn';

describe('Sign In', () => {

    it('default', () => {
        const inst= render(<SignIn/>).toJSON();
        expect(inst).toMatchSnapshot();
      });

});

