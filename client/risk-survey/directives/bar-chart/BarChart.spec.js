import {Component} from '@angular/core';
import BarChart from './BarChart';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [BarChart],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('BarChart', () => {

    beforeEach(() => {
        addProviders([BarChart]);
    });

    it('should return component name', inject([BarChart], (barChart:BarChart) => {
        expect(barChart.name).toBe('BarChart');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<bar-chart></bar-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('bar-chart h1').innerText).toBe('BarChart');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<bar-chart name="TEST"></bar-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('bar-chart h1').innerText).toBe('TEST');
            });
    })));

});
