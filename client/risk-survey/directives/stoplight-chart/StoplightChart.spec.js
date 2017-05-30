import {Component} from '@angular/core';
import StoplightChart from './StoplightChart';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [StoplightChart],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('StoplightChart', () => {

    beforeEach(() => {
        addProviders([StoplightChart]);
    });

    it('should return component name', inject([StoplightChart], (stoplightChart:StoplightChart) => {
        expect(stoplightChart.name).toBe('StoplightChart');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<stoplight-chart></stoplight-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('stoplight-chart h1').innerText).toBe('StoplightChart');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<stoplight-chart name="TEST"></stoplight-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('stoplight-chart h1').innerText).toBe('TEST');
            });
    })));

});
