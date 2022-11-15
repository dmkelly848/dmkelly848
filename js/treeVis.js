/* * * * * * * * * * * * * *
*      Bubble Vis          *
* * * * * * * * * * * * * */
// based on https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a

class TreeVis {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        // // SVG drawing area
        // vis.svg = d3.select("#" + vis.parentElement).append("svg")
        //     .attr("width", vis.width + vis.margin.left + vis.margin.right)
        //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
        //
        // // Scales and axes
        // vis.x = d3.scaleLinear()
        //     .range([0, vis.width])
        //
        // // using ordinal scale for bar charts, similar to hw 5, with source: https://github.com/d3/d3-scale/blob/main/README.md
        // vis.y = d3.scaleBand()
        //     .range([0, vis.height])
        //     // source: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js for padding
        //     .padding(.1)
        //
        // // creating axes with the scales and appending groups
        // vis.xAxis = d3.axisBottom()
        //     .scale(vis.x);
        // vis.yAxis = d3.axisLeft()
        //     .scale(vis.y);
        //
        // vis.svg.append("g")
        //     .attr("class", "x-axis axis")
        //     .attr("transform", "translate(0," + vis.height + ")");
        //
        // vis.svg.append("g")
        //     .attr("class", "y-axis axis");

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        console.log(vis.resultsData)

        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // vis.x.domain([0,vis.width])
        // vis.y.domain(vis.displayData.map(function(d) {console.log(d[""])
        //     return d[""]; }))
        //
        // console.log(vis.y)
        //
        // let bars = vis.svg.selectAll("rect")
        //     .data(vis.displayData);
        //
        // bars.exit().remove()
        //
        // bars.enter().append("rect")
        //     .attr("class", "running-bar")
        //     .merge(bars)
        //     .attr("x", 35)
        //     .attr("y", d => vis.y(d[""]))
        //     .attr("width", 0)
        //     .attr("height", vis.y.bandwidth())
        //     .transition()
        //     // https://www.d3indepth.com/transitions/
        //     .ease(d3.easeLinear)
        //     .duration(function(d) {
        //         return 1000 * d.Clean_Result;
        //     })
        //     .attr("width", d => vis.width - 135)
        //     .attr("fill", "blue")
        //
        // let year_labels = vis.svg.selectAll(".year-label")
        //     .data(vis.displayData)
        //
        // year_labels.exit().remove()
        //
        // year_labels.enter().append("text")
        //     .attr("class","year-label")
        //     .merge(year_labels)
        //     .attr("fill", "black")
        //     .attr("y", d => vis.y(d[""]) + 12)
        //     .attr("x", 0)
        //     .attr("text-anchor","begin")
        //     .text(d => vis.formatDate(d.Year))
        //
        // let time_labels = vis.svg.selectAll(".time-label")
        //     .data(vis.displayData)
        //
        // time_labels.exit().remove()
        //
        // time_labels.enter().append("text")
        //     .attr("class","time-label")
        //     .merge(time_labels)
        //     .attr("fill", "black")
        //     .attr("y", d => vis.y(d[""]) + 12)
        //     .attr("x", vis.width - 95)
        //     .attr("text-anchor","begin")
        //     .text("")
        //     .transition()
        //     // https://www.d3indepth.com/transitions/
        //     .delay(function(d) {
        //         return 1000 * d.Clean_Result;
        //     })
        //     .text(d => d.Clean_Result)
        //
        // let player_labels = vis.svg.selectAll(".player-label")
        //     .data(vis.displayData)
        //
        // player_labels.exit().remove()
        //
        // player_labels.enter().append("text")
        //     .attr("class","player-label")
        //     .merge(player_labels)
        //     .attr("fill", "black")
        //     .attr("y", d => vis.y(d[""]) + 12)
        //     .attr("x", vis.width - 60)
        //     .attr("text-anchor","begin")
        //     .text("")
        //     .transition()
        //     // https://www.d3indepth.com/transitions/
        //     .delay(function(d) {
        //         return 1000 * d.Clean_Result;
        //     })
        //     .text(d => d.Name)
    }
}
