/* * * * * * * * * * * * * *
*          RunningVis          *
* * * * * * * * * * * * * */
//based off hw8 barchart class

class RunningVis {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 30, right: 100, bottom: 15, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // TODO: REVISIT HEIGHT WITH RESPONSIVE UNITS
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])

        // using ordinal scale for bar charts, similar to hw 5, with source: https://github.com/d3/d3-scale/blob/main/README.md
        vis.y = d3.scaleBand()
            .range([0, vis.height])
            // source: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js for padding
            .padding(.1)

        // creating axes with the scales and appending groups
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.displayData = vis.resultsData.filter((d) => {
            return (d.Event === '100M' && d.Medal === 'G' && d.Gender === 'M');
        })

        vis.displayData.sort((a,b)=> a.Year - b.Year);

        console.log(vis.displayData)

        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        vis.x.domain([0,vis.width])
        vis.y.domain(vis.displayData.map(function(d) {console.log(d[""])
            return d[""]; }))

        console.log(vis.y)

        let bars = vis.svg.selectAll("rect")
            .data(vis.displayData);

        bars.exit().remove()

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .attr("x", 0)
            .attr("y", d => vis.y(d[""]))
            .attr("height", vis.y.bandwidth())
            .attr("width", d => vis.x(vis.width))
            .attr("fill", "blue")

        let labels = vis.svg.selectAll(".label")
            .data(vis.displayData)

        labels.exit().remove()

        labels.enter().append("text")
            .attr("class","label")
            .merge(labels)
            .attr("fill", "black")
            .attr("y", d => vis.y(d[""]))
            .attr("x", d => vis.width)
            .attr("text-anchor","begin")
            .text("text")
    }
}
