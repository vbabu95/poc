import {
    addProviders,
    inject
} from '@angular/core/testing';
import SurveyProvider from './SurveyProvider';

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('SurveyProvider.js', () => {

    beforeEach(() => {
        addProviders([SurveyProvider]);
    });

    it('should return  instance', inject([SurveyProvider], (surveyProvider:SurveyProvider) => {
        expect(surveyProvider).toBeDefined();
    }));

    it('should return name', inject([SurveyProvider], (surveyProvider:SurveyProvider) => {
        expect(surveyProvider.name).toBe('SurveyProvider');
    }));

});
