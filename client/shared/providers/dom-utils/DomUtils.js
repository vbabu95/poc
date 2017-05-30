import {Injectable} from '@angular/core';
import * as d3 from 'd3';

/**
 * @example
 * let injector = Injector.resolveAndCreate([DomUtils]);
 * let domUtils = new injector.get(DomUtils);
 * @example
 * class Component {
 * 		constructor(domUtils:DomUtils, domUtils2:DomUtils) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(domUtils === domUtils2);
 *		}
 * }
 */
@Injectable()
export default class DomUtils {

    constructor() {

    }

    getChartSizeForElement(element, margins, scaleBase) {
        let elSize = element.getBoundingClientRect();

        let size = {
            baseWidth: elSize.width,
            baseHeight: elSize.height,
            width: elSize.width,
            height: elSize.height
        };

        if (margins) {
            size.width = elSize.width - margins.left - margins.right;
            size.height = elSize.height - margins.top - margins.bottom;
        }

        if (scaleBase) {
            size.scale = Math.min(elSize.width / scaleBase, elSize.height / scaleBase);
        }

        return size;
    }

    getChartSizeForSelector(d3Selector, margins) {
        let element = d3.select(d3Selector).node();
        let size = this.getChartSizeForElement(element, margins);
        return size;
    }

    // Taken from http://bl.ocks.org/mbostock/7555321
    // License: GPL-3.0
    // Wraps SVG text
    wrapSvgText(textElements, width) {
        textElements.each(function () {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word = words.pop(),
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
			    x = text.attr("x"),
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
                word = words.pop();
            }
        });
    }

    appendWrappedScore(textElements, data) {
        textElements.each(function (d, i) {
            let text = d3.select(this),
                spans = text.selectAll("tspan").size(),
                lineHeight = 1.1, // ems
			    x = text.attr("x"),
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy"));

            text.append("tspan")
                .text(data[i].text)
                .attr("x", x)
                .attr("y", y)
                .attr("dy", spans * lineHeight + dy + "em")
                .attr("class", "score-fill " +  data[i].status);
        });
    }
}
