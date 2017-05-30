import {
    addProviders,
    inject
} from '@angular/core/testing';
import ScoreStatusProvider from './ScoreStatusProvider';

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('ScoreStatusProvider.js', () => {

    beforeEach(() => {
        addProviders([ScoreStatusProvider]);
    });

    it('should return  instance', inject([ScoreStatusProvider], (scoreStatusProvider:ScoreStatusProvider) => {
        expect(scoreStatusProvider).toBeDefined();
    }));

    it('should return name', inject([ScoreStatusProvider], (scoreStatusProvider:ScoreStatusProvider) => {
        expect(scoreStatusProvider.name).toBe('ScoreStatusProvider');
    }));

});
