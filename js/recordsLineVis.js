class RecordsLineVis {

    constructor(parentElement, data, records, hostData) {
        this.parentElement = parentElement;
        this.data = data;
        this.records = records;
        this.hostData = hostData;

        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention
        vis.margin = {top: 20, right: 10, bottom: 20, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // creating scales for barplot: scalelinear and scaleband, and creating axes
        vis.x = d3.scaleLinear()
            .domain([1896,2016])
            .range([.1 * vis.width, vis.width * .95])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickValues(d3.range(1896,2020,4))
            //https://stackoverflow.com/questions/16549868/d3-remove-comma-delimiters-for-thousands
            .tickFormat(d3.format("d"))
            .ticks()

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height * .92 + ")");

        vis.xAxisGroup
            .call(vis.xAxis)
            .selectAll('text')
            .attr('text-anchor', 'middle')
            .attr("transform", "translate(0," + 1 + ")");

        vis.y = d3.scaleBand()
            .domain(vis.records.map(d => d.Competition))
            .range([.02 * vis.height,.92 * vis.height])
            .paddingInner(.8)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            // https://stackoverflow.com/questions/19787925/create-a-d3-axis-without-tick-labels
            .tickSize(0)
            .ticks();

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + vis.width * .1 + ", 0)");

        vis.yAxisGroup
            .call(vis.yAxis)

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        // filtering data to only show current records
        vis.displayData = vis.records

        vis.chosenYear = vis.parseDate(vis.hostData[mapYearIndex].Year)

        vis.displayData = vis.displayData.filter(function (d) {
            return (d['Set'] <= vis.formatDate(vis.chosenYear) && d['Broken'] > vis.formatDate(vis.chosenYear) )
        });

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // enter-update-exit on bars
        vis.lines = vis.svg.selectAll('rect').data(vis.displayData)

        vis.lines.exit().remove()

        vis.lines.enter().append("rect")
            .merge(vis.lines)
            .attr('class','record-line')
            .attr("y", d=> vis.y(d.Competition))
            .attr('height', vis.y.bandwidth())
            .attr('width', d=> vis.x(vis.hostData[mapYearIndex].Year) - vis.x(d.Set))
            .attr("x", d=> vis.x(d.Set))
            .attr("fill", function(d){
                if (d.Gender === 'M'){
                    return '#ADDEFF'
                }
                if (d.Gender === 'W'){
                    return '#ffc0af'
                }
            });

        // enter-update-exit on circles
        vis.circles = vis.svg.selectAll(`circle`).data(vis.displayData)

        vis.circles.exit().remove()

        vis.circles.enter().append("circle")
            .attr('class', `circle`)
            .merge(vis.circles)
            .attr("cx", d=> vis.x(d.Set))
            .attr("cy", d=> vis.y(d.Competition) + vis.y.bandwidth()/2)
            .attr("r", 2 * vis.y.bandwidth())
            .attr("fill", function(d){
                if (d.Gender === 'M' && d.Set !== vis.hostData[mapYearIndex].Year){
                    return '#ADDEFF'
                }
                if (d.Gender === 'W' && d.Set !== vis.hostData[mapYearIndex].Year){
                    return '#ffc0af'
                }
                if (d.Gender === 'M' && d.Set === vis.hostData[mapYearIndex].Year){
                    return '#3e76ec'
                }
                if (d.Gender === 'W' && d.Set === vis.hostData[mapYearIndex].Year){
                    return '#ff4500'
                }
            });
    }

}