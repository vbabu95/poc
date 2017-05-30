import {Component} from '@angular/core';
import RadarChart from './RadarChart';
import {
    addProviders,
    async,
    inject,
    TestComponentBuilder,
    ComponentFixture
} from '@angular/core/testing';

@Component({
    selector: 'test-component',
    directives: [RadarChart],
    template: ''
})
class TestComponent {}

//TODO: Enable tests by changing "xdescribe" to "describe"
xdescribe('RadarChart', () => {

    beforeEach(() => {
        addProviders([RadarChart]);
    });

    it('should return component name', inject([RadarChart], (radarChart:RadarChart) => {
        expect(radarChart.name).toBe('RadarChart');
    }));

    it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<radar-chart></radar-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('radar-chart h1').innerText).toBe('RadarChart');
            });
    })));

    it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
        return tcb
            .overrideTemplate(TestComponent, `<radar-chart name="TEST"></radar-chart>`)
            .createAsync(TestComponent)
            .then((fixture:ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.nativeElement.querySelector('radar-chart h1').innerText).toBe('TEST');
            });
    })));

});
