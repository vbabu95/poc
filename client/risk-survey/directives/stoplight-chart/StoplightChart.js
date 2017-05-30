import {Component, Input} from '@angular/core';
import template from './StoplightChart.html';
import styles from './StoplightChart.scss';

@Component({
    selector: 'stoplight-chart',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <stoplight-chart name="StoplightChart" (change)="onChange($event)"></stoplight-chart>
 */
export default class StoplightChart {

    /**
     * The survery to render.
     */
    @Input() survey:Object;

    constructor() {

    }
}
