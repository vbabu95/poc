import Survey from './Survey';
import SurveySection from '../../directives/survey-section';
import SurveyResults from '../../directives/survey-results';

/**
 * @see https://angular.io/docs/ts/latest/api/router/index/Route-interface.html
 * @type {*}
 */
const ROUTE = {
    path: 'survey',
    component: Survey,
    children: [
        {
            path: '',
            redirectTo: 'section/1',
            pathMatch: 'full'
        },
        {
            path: 'section',
            redirectTo: 'section/1',
            pathMatch: 'full'
        },
        {
            path: 'section/:sectionId',
            component: SurveySection
        },
        {
            path: 'results',
            component: SurveyResults
        }
    ]
};

export default ROUTE;
