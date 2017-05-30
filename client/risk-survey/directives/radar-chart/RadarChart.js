import { Component, Input } from '@angular/core';
import template from './RadarChart.html';
import styles from './RadarChart.scss';
import DomUtils from '../../../shared/providers/dom-utils';
import * as d3 from 'd3';

@Component({
    selector: 'radar-chart',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <radar-chart name="RadarChart" (change)="onChange($event)"></radar-chart>
 */
export default class RadarChart {

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
        this.container = d3.select(".survey-radar-chart");

        if (this.survey) {
            this.renderRadarChart();
        }
    }

    renderRadarChart() {
        let mrg = 130,
            margin = { top: mrg, right: mrg, bottom: mrg, left: mrg },
            unscaledBounds = 576,
            unscaledContentSize = unscaledBounds - margin.top - margin.bottom,
            previousSize = this.chartSize;

        this.chartSize = this._domUtils.getChartSizeForElement(this.container.node(), margin, unscaledBounds);

        if (!previousSize || previousSize.width !== this.chartSize.width) {
            // create a data axis for the chart mapped from our survey results
            let data = this.survey.sections.map((section) => {
                return {
                    axis: section.title,
                    value: section.score,
                    text: section.scoreText,
                    status: section.scoreDescription
                };
            });

            // wrap the axis data in an array, as the radar chart can support multiple axes
            data = [data];

            // specify a fixed color for the axis, we assume only one here
            let color = d3.scaleOrdinal().range(["#010c56"]);

            let radarChartOptions = {
                w: unscaledContentSize,
                h: unscaledContentSize,
                vw: unscaledBounds,
                vh: unscaledBounds,
                s: this.chartSize.scale,
                margin: margin,
                maxValue: 1,
                levels: 5,
                roundStrokes: true,
                color: color
            };

            //Call function to draw the Radar chart
            this.radarChart(this.container, data, radarChartOptions);
        }
    }

    /////////////////////////////////////////////////////////
    /////////////// The Radar Chart Function ////////////////
    /////////////// Written by Nadieh Bremer ////////////////
    ////////////////// VisualCinnamon.com ///////////////////
    /////////// Inspired by the code of alangrafu ///////////
    /////////////////////////////////////////////////////////
    // taken from:  http://bl.ocks.org/nbremer/21746a9668ffdf6d8242
    // license: mit
    // modified for ES6 and d3 v4
    radarChart(container, data, options) {
        let cfg = {
            w: 600,				//Width of the circle
            h: 600,				//Height of the circle
            vw: 600,			//Viewbox width of the circle
            vh: 600,			//Viewbox height of the circle
            s: 1,				//Scale of the circle
            margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
            levels: 3,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.45, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 150, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
        };

        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (let i in options) {
                if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
            }//for i
        }//if

        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        let maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })); }));

        let allAxis = data[0],	//Names of each axis
            //allAxis = (data[0].map(function (i) { return i.axis; })),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            format = d3.format(".0%"),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        //Scale for the radius
        let rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        /////////////////////////////////////////////////////////
        //////////// Create the container SVG and g /////////////
        /////////////////////////////////////////////////////////

        //Remove whatever chart with the same id/class was present before
        container.select("svg").remove();

        //Initiate the radar chart SVG
        let svg = container.append("svg")
            //.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)    // using the viewbox and css to size the chart
            //.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)   // using the viewbox and css to size the chart
            .attr("class", "radar")
            .attr("preserveAspectRatio", "xMidYMid meet")
            //.attr("transform", "scale(" + cfg.s + ")");                   // scale isn't supported in ie11
            .attr("viewBox", "0 0 " +  cfg.vw + " "  + cfg.vh);

        //Append a g element
        let g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

        /////////////////////////////////////////////////////////
        ////////// Glow filter for some extra pizzazz ///////////
        /////////////////////////////////////////////////////////

        //Filter for the outside glow
        let filter = g.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'), // eslint-disable-line
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'), // eslint-disable-line
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic'); // eslint-disable-line

        /////////////////////////////////////////////////////////
        /////////////// Draw the Circular grid //////////////////
        /////////////////////////////////////////////////////////

        //Wrapper for the grid & axes
        let axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function (d) { return radius / cfg.levels * d; })
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", function (d) { return -d * radius / cfg.levels; })
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(function (d) { return format(maxValue * d / cfg.levels); });

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////

        //Create the straight lines radiating outward from the center
        let axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return rScale(maxValue * 1.0) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return rScale(maxValue * 1.0) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
            .text(function (d) { return d.axis; })
            .attr("class", (d) => { return "section-status " + d.status; })
            .call(this._domUtils.wrapSvgText, cfg.wrapWidth)
            .call(this._domUtils.appendWrappedScore, allAxis);

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////

        //The radial line function
        let radarLine = d3.radialLine()
            .curve(d3.curveLinearClosed)
            .radius(function (d) { return rScale(d.value); })
            .angle(function (d, i) { return i * angleSlice; });

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveCardinalClosed);
        }

        //Create a wrapper for the blob
        let blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");

        //Append the backgrounds
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function (d) { return radarLine(d); })
            .style("fill", function (d, i) { return cfg.color(i); })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function () {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', function () {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            });

        //Create the outlines
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d) { return radarLine(d); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function (d, i) { return cfg.color(i); })
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function (d) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", function (d, i, j) { return cfg.color(j); })
            .style("fill-opacity", 0.8);

        /////////////////////////////////////////////////////////
        //////// Append invisible circles for tooltip ///////////
        /////////////////////////////////////////////////////////

        //Wrapper for the invisible circles on top
        let blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Set up the small tooltip for when you hover over a circle
        let tooltip = g.append("text")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function (d) { return d; })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.5)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function (d) {
                let newX = parseFloat(d3.select(this).attr('cx')) - 10;
                let newY = parseFloat(d3.select(this).attr('cy')) - 10;

                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(format(d.value))
                    .transition().duration(200)
                    .style('opacity', 1);
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            });

    }//RadarChart
}
