import {Component} from '@angular/core';
import SurveyResults from './SurveyResults';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [SurveyResults],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('SurveyResults', () => {

    beforeEach(() => {
        addProviders([SurveyResults]);
    });

    it('should return component name', inject([SurveyResults], (surveyResults:SurveyResults) => {
        expect(surveyResults.name).toBe('SurveyResults');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<survey-results></survey-results>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('survey-results h1').innerText).toBe('SurveyResults');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<survey-results name="TEST"></survey-results>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('survey-results h1').innerText).toBe('TEST');
            });
    })));

});
