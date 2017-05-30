import {Component} from '@angular/core';
import Survey from './Survey';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [Survey],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('Survey.js', () => {

    beforeEach(() => {
        addProviders([
            Survey
        ]);
    });

    it('should initialize default name', inject([Survey], (survey:Survey) => {
        expect(survey.name).toBe('Survey');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<survey></survey>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('survey h1').innerText).toBe('Survey');
            });
    })));

});
