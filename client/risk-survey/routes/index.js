export const RISK_SURVEY_ROUTES = [];
export const RISK_SURVEY_COMPONENTS = [];

import Survey from './survey';
export {Survey as Survey};
RISK_SURVEY_ROUTES.push(Survey);
RISK_SURVEY_COMPONENTS.push(Survey.component);

// default routes
RISK_SURVEY_ROUTES.push({ path: '', redirectTo: '/survey/section/1', pathMatch: 'full' });