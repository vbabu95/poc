import {Injectable} from '@angular/core';

/**
 * @example
 * let injector = Injector.resolveAndCreate([ScoreStatusProvider]);
 * let scoreStatusProvider = new injector.get(ScoreStatusProvider);
 * @example
 * class Component {
 * 		constructor(scoreStatusProvider:ScoreStatusProvider, scoreStatusProvider2:ScoreStatusProvider) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(scoreStatusProvider === scoreStatusProvider2);
 *		}
 * }
 */
@Injectable()
export default class ScoreStatusProvider {

    constructor() {

    }

    getClassForScore(score) {
        let result:String;
        if (score >= 0.8) {
            result = 'advanced';
        } else if (score >= 0.6) {
            result = 'integrated';
        } else {
            result = 'immature';
        }
        return result;
    }

    getHarveyIconForScore(score) {
        let result:String;
        if (score >= 1) {
            result = 'icons-harvey-full';
        } else if (score >= 0.75) {
            result = 'icons-harvey-three-quarter';
        } else if (score >= 0.5) {
            result = 'icons-harvey-half';
        } else if (score >= 0.25) {
            result = 'icons-harvey-quarter';
        } else {
            result = 'icons-harvey-empty';
        }
        return result;
    }
}
