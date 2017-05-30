import {provideRoutes} from '@angular/router';
import {RISK_SURVEY_ROUTES} from '../routes';
export const RISK_SURVEY_PROVIDERS = [
    provideRoutes(RISK_SURVEY_ROUTES)
];

import SurveyProvider from './survey-provider';
export {SurveyProvider as SurveyProvider};
RISK_SURVEY_PROVIDERS.push(SurveyProvider);
import ScoreStatusProvider from './score-status-provider';
export {ScoreStatusProvider as ScoreStatusProvider};
RISK_SURVEY_PROVIDERS.push(ScoreStatusProvider);