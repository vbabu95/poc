import {Component, trigger, state, style, transition, animate} from '@angular/core';
import template from './SurveyResults.html';
import styles from './SurveyResults.scss';
import {Router} from '@angular/router';
import SurveyProvider from '../../providers/survey-provider';
import ScoreStatusProvider from '../../providers/score-status-provider';
import _ from 'lodash';

@Component({
    selector: 'survey-results',
    template: template,
    styles: [styles],
    animations: [
        trigger('sectionVisible', [
            state('show', style({
                opacity: '1',
                height: '*',
                display: 'block'
            })),
            state('hide', style({
                opacity: '0',
                height: '0',
                display: 'none'
            })),
            transition('show => hide', animate('350ms ease-in')),
            transition('hide => show', animate('350ms ease-out'))
        ])
    ]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <survey-results name="SurveyResults" (change)="onChange($event)"></survey-results>
 */
export default class SurveyResults {

    VIS_SHOW:String = 'show';
    VIS_HIDE:String = 'hide';

    currentSurvey:Object;
    prioritySections:Array;
    currentChartIndex:Number = 0;

    constructor(router: Router, survey:SurveyProvider, scoreStatus:ScoreStatusProvider) {
        this._router = router;
        this._survey = survey;
        this._scoreStatus = scoreStatus;
    }

    ngOnInit() {
        if (this._survey.activeSurvey && this._survey.activeSurvey.surveyComplete) {
            // if a survey already exists as active, score it for rendering
            this.currentSurvey = this._survey.activeSurvey;
            this.scoreSurvey();
        } else {
            // don't have a valid survey, route back to the questionnaire
            this._router.navigate(['/survey/section']);
        }
    }

    scoreSurvey() {
        // score each of the sections in the survey
        this.currentSurvey.sections.forEach(section => {
            let subsectionSum = 0;

            // score each subsection
            section.subsections.forEach(subsection => {
                this.scoreSubsection(subsection);
                subsectionSum += subsection.score;
            });

            // aggregate the subsection scores into a section score
            section.score = Math.round(subsectionSum / section.subsections.length * 100) / 100;
            section.scoreText = section.score * 100 + '%';
            section.scoreDescription = this._scoreStatus.getClassForScore(section.score);
            section.scoreHarvey = this._scoreStatus.getHarveyIconForScore(section.score);
            section.visibilityState = (section.score < 0.8) ? this.VIS_SHOW : this.VIS_HIDE;
        });

        // created another sorted set of sections for the priority display
        this.prioritySections = this.currentSurvey.sections.concat().sort((a, b) => { return a.score - b.score; });
    }

    scoreSubsection(subsection) {
        let scoreLevelIndex = 0;
        let positiveResponses = _.filter(subsection.questions, function (qst) {
            return qst.selectedResponse === qst.responses[0];
        });
        let positiveResponseIds = _.map(positiveResponses, 'questionId');
        let index = subsection.scoreLevels.length - 1;

        // find the highest score level that is met
        for (; index >= 0; index--) {
            let requiredQuestionIds = subsection.scoreLevels[index].requiredQuestionIds;
            let scoreIntersection = _.intersection(positiveResponseIds, requiredQuestionIds);
            if (scoreIntersection.length === requiredQuestionIds.length) {
                // all the necessarry questions for this score level are present
                scoreLevelIndex = index;
                break;
            }
        }

        // tag each of the levels as met or unmet for the view
        index = 0;
        for (; index < subsection.scoreLevels.length; index++) {
            if (index <= scoreLevelIndex) {
                subsection.scoreLevels[index].met = true;
            } else {
                subsection.scoreLevels[index].met = false;
            }
        }

        // compute the overall score
        subsection.scoreLevelIndex = scoreLevelIndex;
        subsection.score = (scoreLevelIndex + 1) / subsection.scoreLevels.length;
    }

    toggleSectionVisibility(section) {
        if (section.visibilityState === this.VIS_SHOW) {
            section.visibilityState = this.VIS_HIDE;
        } else {
            section.visibilityState = this.VIS_SHOW;
        }
    }

    setChartIndex(index) {
        this.currentChartIndex = index;
    }
}
