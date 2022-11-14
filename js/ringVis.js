/* * * * * * * * * * * * * *
*          RingVis          *
* * * * * * * * * * * * * */

class RingVis {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleTime()
            .range([0, vis.width]);
        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform","translate(0,"+vis.height+")")
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "axis y-axis")

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.eventcategory = d3.select("#eventcategory").property("value")

        vis.updateVis()
    }



    updateVis() {
        let vis = this;


    }
}
