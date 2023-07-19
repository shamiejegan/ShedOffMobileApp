import React from 'react';
import { render, fireEvent,screen} from '@testing-library/react-native';

import SignUp from '../../scripts/onboarding/signUp';

describe('SignUp', () => {

    it('default', () => {
        const inst= render(<SignUp/>).toJSON();
        expect(inst).toMatchSnapshot();
      });

});
