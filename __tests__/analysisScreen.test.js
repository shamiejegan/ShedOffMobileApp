import React from 'react';
import { render } from '@testing-library/react-native';

import AnalysisScreen from '../scripts/analysisScreen';

describe('Analysis Screen', () => {

    it('default', () => {
        const inst= render(<AnalysisScreen navigation={{}} route={{params:'user123'}}/>).toJSON();
        expect(inst).toMatchSnapshot();
    });

});

