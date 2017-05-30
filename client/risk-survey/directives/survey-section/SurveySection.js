import {Component, ViewChild, ElementRef, trigger, state, style, transition, animate} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import _ from 'lodash';
import template from './SurveySection.html';
import styles from './SurveySection.scss';
import SurveyProvider from '../../providers/survey-provider';

@Component({
    selector: 'survey-section',
    template: template,
    styles: [styles],
    animations: [
        trigger('questionVisible', [
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
            transition('show => hide', animate('250ms ease-in')),
            transition('hide => show', animate('250ms ease-out'))
        ])
    ]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <survey-section name="SurveySection" (change)="onChange($event)"></survey-section>
 */
export default class SurveySection {

    @ViewChild('questionScroller') questionScroller:ElementRef;

    VIS_SHOW:String = 'show';
    VIS_HIDE:String = 'hide';

    currentSurvey:Object;
    currentSectionId:String;
    currentSection:Object;
    nextSection:Object;

    constructor(route:ActivatedRoute, survey:SurveyProvider) {
        this._route = route;
        this._survey = survey;
    }

    ngOnInit() {
        // subscribe for route changes related to the survey section
        this._route.params.subscribe(params => {
            const sectionPropertyName:String = 'sectionId';
            if (params.hasOwnProperty(sectionPropertyName)) {
                this.currentSectionId = params[sectionPropertyName];
                this.loadSectionFromSurvey();
            }
        });

        // subscribe to surveys loading
        this._survey.surveyLoaded.subscribe(() => this.configureSurvey());

        // if a survey already exists as active, load from it now
        if (this._survey.activeSurvey) {
            this.configureSurvey();
        }
    }

    configureSurvey() {
        if (this._survey.activeSurvey) {
            this.currentSurvey = this._survey.activeSurvey;

            // if the survey is not already complete, set it up for its first display in the view
            if (!this.currentSurvey.surveyComplete) {

                // add UI state to the sections
                this.currentSurvey.sections.forEach(section => {
                    section.sectionActive = false;
                    section.sectionComplete = false;

                    // add UI state to the questions
                    section.subsections.forEach(subsection => {
                        subsection.questions.forEach(question => {
                            if (question.dependentIds) {
                                question.visibityState = this.VIS_HIDE;
                            } else {
                                question.visibityState = this.VIS_SHOW;
                            }

                            // FIXME: debugging, remove later.
                            // question.selectedResponse = question.responses[0];
                            // question.visibityState = this.VIS_SHOW;
                        });
                    });

                    // FIXME: debugging, remove later.
                    // section.sectionActive = true;
                    // section.sectionComplete = true;
                });

                this.currentSurvey.sections[0].sectionActive = true;

                // FIXME: debugging, remove later.
                // this.currentSurvey.surveyComplete = true;
            }

            this.loadSectionFromSurvey();
        }
    }

    loadSectionFromSurvey() {
        if (this.currentSurvey) {
            // if no section id is set, default to the first
            if (!this.currentSectionId) {
                this.currentSectionId = this.currentSurvey.sections[0].sectionId;
            }

            // find the target section in survey
            let section = _.find(this.currentSurvey.sections, (section) => { return section.sectionId === this.currentSectionId; });
            this.currentSection = section;

            // find the next section, if it exists
            let nextSectionIndex = this.currentSurvey.sections.indexOf(this.currentSection) + 1;
            if (nextSectionIndex < this.currentSurvey.sections.length) {
                this.nextSection = this.currentSurvey.sections[nextSectionIndex];
            } else {
                this.nextSection = undefined;
            }

            // scroll the questions view to the top
            if (this.questionScroller) {
                this.questionScroller.nativeElement.scrollTop = 0;
            }
        }
    }

    getSubsectionQuestionsByIds(ids, subsection) {
        let questions = [];
        if (ids && ids.length) {
            ids.forEach(id => {
                let question = _.find(subsection.questions, { questionId: id });
                if (question) {
                    questions.push(question);
                }
            });
        }
        return questions;
    }

    getParentDependents(question, subsection) {
        let dependents = this.getSubsectionQuestionsByIds(question.dependentIds, subsection);
        return dependents;
    }

    getChildDependents(question, subsection) {
        let dependents = _.filter(subsection.questions, function (qst) {
            return qst.dependentIds && qst.dependentIds.indexOf(question.questionId) >= 0;
        });
        return dependents;
    }

    getChildDependentsRecurvsive(question, subsection) {
        let dependents = this.getChildDependents(question, subsection);
        if (dependents.length) {
            let childDependents = [];
            dependents.forEach(qst => {
                childDependents = childDependents.concat(this.getChildDependentsRecurvsive(qst, subsection));
            });
            if (childDependents.length) {
                dependents = _.unionBy(dependents, childDependents, 'questionId');
            }
        }
        return dependents;
    }

    isQuestionVisible(question, subsection) {
        let result = this.VIS_SHOW;

        if (question.dependentIds) {
            let dependents = this.getParentDependents(question, subsection);
            let satisfied = _.every(dependents, function (qst) {
                return qst.selectedResponse === qst.responses[0];
            });
            if (!satisfied) {
                result = this.VIS_HIDE;
            } else {
                result = this.VIS_SHOW;
            }
        }

        return result;
    }

    setQuestionsResponse(question, subsection, response) {
        question.selectedResponse = response;

        // update dependent question state
        let dependents = this.getChildDependentsRecurvsive(question, subsection);
        dependents.forEach(qst => {
            if (question.selectedResponse !== question.responses[0]) {
                // the question was marked as 'negative', handle downstream responses.
                // reset them to clear state to hide dependent questions.
                qst.selectedResponse = undefined;
                qst.visibityState = this.VIS_HIDE;
            } else {
                // the question was marked as 'positive', determine if dependents should be shown
                qst.visibityState = this.isQuestionVisible(qst, subsection);
            }
        });

        // update the section state
        this.currentSection.sectionComplete = this.isSectionCompleted(this.currentSection);
        if (this.currentSection.sectionComplete && this.nextSection) {
            // activate the next section
            this.nextSection.sectionActive = true;
        }

        // update the survey state
        this.currentSurvey.surveyComplete = this.isSurveyCompleted();
    }

    isSubsectionCompleted(subsection) {
        // find all the questions that are currently visible
        let topLevelQuestions = _.filter(subsection.questions, (qst) => {
            return qst.visibityState === this.VIS_SHOW;
        });

        // see if each has a response
        let completed = _.every(topLevelQuestions, function (qst) {
            return !!qst.selectedResponse;
        });

        return completed;
    }

    isSectionCompleted(section) {
        let completed = _.every(section.subsections, (sect) => {
            return this.isSubsectionCompleted(sect);
        });

        return completed;
    }

    isSurveyCompleted() {
        let completed = _.every(this.currentSurvey.sections, (sect) => {
            return sect.sectionComplete;
        });

        return completed;
    }
}
