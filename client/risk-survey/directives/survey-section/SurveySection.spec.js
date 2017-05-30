import {Component} from '@angular/core';
import SurveySection from './SurveySection';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [SurveySection],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('SurveySection', () => {

    beforeEach(() => {
        addProviders([SurveySection]);
    });

    it('should return component name', inject([SurveySection], (surveySection:SurveySection) => {
        expect(surveySection.name).toBe('SurveySection');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<survey-section></survey-section>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('survey-section h1').innerText).toBe('SurveySection');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<survey-section name="TEST"></survey-section>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('survey-section h1').innerText).toBe('TEST');
            });
    })));

});
