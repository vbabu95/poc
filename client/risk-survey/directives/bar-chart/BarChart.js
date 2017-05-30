import { Component, Input, HostListener } from '@angular/core';
import template from './BarChart.html';
import styles from './BarChart.scss';
import DomUtils from '../../../shared/providers/dom-utils';
import * as d3 from 'd3';

@Component({
    selector: 'bar-chart',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <bar-chart name="BarChart" (change)="onChange($event)"></bar-chart>
 */
export default class BarChart {

    /**
     * The survery to render.
     */
    @Input() survey: Object;

    chartContainer:Object;
    chartSize:Object;

    constructor(domUtils: DomUtils) {
        this._domUtils = domUtils;
    }

    ngOnInit() {
        this.container = d3.select(".survey-bar-chart");

        if (this.survey) {
            this.renderBarChart();
        }
    }

    @HostListener('window:resize')
	onWindowResize() {
        this.renderBarChart();
	}

    renderBarChart() {

        let data = this.survey.sections,
            margin = { top: 140, right: 0, bottom: 120, left: 40 },
            previousSize = this.chartSize,
            newSize = this._domUtils.getChartSizeForElement(this.container.node(), margin);

        if (!previousSize || previousSize.width !== newSize.width) {
            this.chartSize = newSize;

            // remove any previous chart
            this.container.select("svg").remove();

            // create a new chart
            let svg = this.container.append('svg'),
                tip = d3.tip().html((d) => this.buildTipForScore(d));

            svg.attr('width', newSize.baseWidth).attr('height', newSize.baseHeight);
            svg.call(tip);

            let x = d3.scaleBand().rangeRound([0, newSize.width]).padding(0.1),
                y = d3.scaleLinear().rangeRound([newSize.height, 0]);

            let g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function (d) { return d.title; }));
            //x.domain(data);
            y.domain([0, 1]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + newSize.height + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .selectAll("text")
                .attr("class", (d, i) => { return "section-status " + data[i].scoreDescription; })
                .attr("transform", "translate(-36, 32) rotate(-40)")    // this has to be on the SVG element for ie11
                .call(this._domUtils.wrapSvgText, 100);

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y)
                .ticks(10, "%")
                .tickSize(0));

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", function (d) { return "bar " + d.scoreDescription; })
                .attr("x", function (d) { return x(d.title) + x.bandwidth() / 4; })
                .attr("y", function (d) { return y(d.score); })
                .attr("width", x.bandwidth() / 2)
                .attr("height", function (d) { return newSize.height - y(d.score); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }
    }

    buildTipForScore(d) {
        let scoreClass:String = d.scoreDescription,
            html:String = '<div><div class="score-tip-text score-background score-foreground ' + scoreClass + '">' + Math.round(d.score * 100) + '%</div><div class="score-tip-arrow score ' + scoreClass + '"></div></div>';
        return html;
    }
}
