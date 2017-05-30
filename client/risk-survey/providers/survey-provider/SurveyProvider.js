import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
//import Api from '../../../../raml/api.v1.raml';

/**
 * @example
 * let injector = Injector.resolveAndCreate([SurveyProvider]);
 * let surveyProvider = new injector.get(SurveyProvider);
 * @example
 * class Component {
 * 		constructor(surveyProvider:SurveyProvider, surveyProvider2:SurveyProvider) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(surveyProvider === surveyProvider2);
 *		}
 * }
 */
@Injectable()
export default class SurveyProvider {

    @Output() surveyLoaded:EventEmitter = new EventEmitter();

    mockServiceUrl:string = 'mock/member.example.json';
    http:Http = undefined;
    surveyObs:Observable = undefined;

    activeSurvey:Object;

    constructor(http:Http) {
        this.http = http;
    }

    // FIXME: once services are available, use the Api to load the survey
    loadSurvey() {
        this.surveyObs = this.http.get(this.mockServiceUrl).map(this.handleServiceMap);
        this.surveyObs.subscribe((survey) => {
            this.activeSurvey = survey;
            this.surveyLoaded.emit(this.activeSurvey);
        });
    }

    handleServiceMap(res:Response) {
        let body = res.json();
        return body.data || body || {};
    }

    // TODO:  once services are available, use the Api to load the survey
    // async loadSurvey() {
    //     let api = new Api();
    //     this.activeSurvey = await api.surveys.current.get().json();
    //     this.surveyLoaded.emit(this.activeSurvey);
    // }
}
