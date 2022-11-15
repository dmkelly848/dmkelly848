/* * * * * * * * * * * * * *
*      Dash Bar          *
* * * * * * * * * * * * * */

class DashBar {

    constructor(parentElement, resultsData, continentData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 30, bottom: 40, left: 30};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text('Medals Won by Year')
            .attr('font-size', 'smaller')
            .attr('transform', `translate(${vis.width / 2}, ${vis.height / 10})`)
            .attr('text-anchor', 'middle');

        // // add tooltip area
        // vis.tooltip = d3.select("body").append('div')
        //     .attr('class', "tooltip")
        //     .attr('id', 'barTooltip')


        // Create scales and axes
        // add x scale
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(vis.width/5000)
            .paddingOuter(vis.width/5000);

        // add y scale
        vis.y = d3.scaleLinear()
            .range([vis.height, vis.height*1/5]);

        // add xaxis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d=>vis.formatDate(d))
            .ticks()

        // add y axis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // create axis groups
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;


        vis.filtData = []
        vis.resultsData.forEach(row => {
            if (row.Nationality === selCountry || selCountry === 'Worldwide')
                vis.filtData.push(row)
        })
        console.log(vis.filtData)
        vis.displayData = []
        vis.filtData.forEach(row => {
                let year = vis.formatDate(row.Year);
                let yearObj = {};
                let existing = vis.displayData.map(d => d.year);
                if (!(existing.includes(year))) {
                    yearObj['year'] = year;
                    yearObj['medal_count'] = 1;
                    vis.displayData.push(yearObj)
                } else {
                    vis.displayData.find(d => d.year === year).medal_count += 1;
                }
            }
        )
        vis.displayData.sort((a,b)=> a.year - b.year);
        console.log(vis.displayData)
        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // update domains
        vis.y.domain([0, d3.max(vis.displayData, d=>d.medal_count)]);
        vis.x.domain(vis.displayData.map(d=>vis.parseDate(d.year)))
        // add bars using enter, update, exit methods
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.displayData)
        vis.bars.exit().remove();

        vis.bars.enter().append("rect")
            .attr("class", "bar")
            .merge(vis.bars)
            .attr("x", d=> vis.x(vis.parseDate(d.year)))
            .attr("y", d=> vis.y(d.medal_count))
            .attr("width", vis.x.bandwidth())
            .attr("height", d=> vis.height - vis.y(d.medal_count))
            .style("fill", '#555555')

        // Call axis functions with the new domain
        vis.xAxisGroup
            .transition()
            .duration(300)
            .call(vis.xAxis);
        vis.yAxisGroup
            .transition()
            .duration(300)
            .call(vis.yAxis);

    }
}