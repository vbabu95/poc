import {Component} from '@angular/core';
import template from './Survey.html';
import styles from './Survey.scss';
import SurveyProvider from '../../providers/survey-provider';

@Component({
    selector: 'survey',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/guide/router.html
 */
export default class Survey {

    constructor(survey:SurveyProvider) {
        this._survey = survey;
    }

    ngOnInit() {
        if (!this._survey.activeSurvey) {
            this._survey.loadSurvey();
        }
    }
}
