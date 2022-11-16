/* * * * * * * * * * * * * *
*      Dash Bar          *
* * * * * * * * * * * * * */

class DashBar {

    constructor(parentElement, resultsData, selectedCategory) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.selectedCategory = selectedCategory;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {}
        if(vis.selectedCategory==='Year')
            vis.margin = {top: 20, right: 30, bottom: 40, left: 30};
        else
            vis.margin = {top: 20, right: 30, bottom: 100, left: 30};
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
            .text(`Medals Won by ${vis.selectedCategory}`)
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
            .tickFormat(function(d){
                if(vis.selectedCategory=='Year')
                    return vis.formatDate(d);
                else
                    return d
            })
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

        // add tooltip area
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.filtData = []
        vis.resultsData.forEach(row => {
            if (row.Nationality === selCountry || selCountry === 'Worldwide')
                vis.filtData.push(row)
        })

        vis.displayData = []
        vis.filtData.forEach(row => {
                let val = '';
                if (vis.selectedCategory === 'Year')
                    val = vis.formatDate(row[vis.selectedCategory]);
                else
                    val = row[vis.selectedCategory]
                let valObj = {};
                let existing = vis.displayData.map(d => d[vis.selectedCategory]);
                if (!(existing.includes(val))) {
                    valObj[vis.selectedCategory] = val;
                    valObj['medal_count'] = 1;
                    vis.displayData.push(valObj)
                } else {
                    vis.displayData.find(d => d[vis.selectedCategory] === val).medal_count += 1;
                }
            }
        )
        vis.displayData.sort((a,b)=> a[vis.selectedCategory] - b[vis.selectedCategory]);
        console.log(vis.displayData)
        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // update domains
        vis.y.domain([0, d3.max(vis.displayData, d=>d.medal_count)]);
        vis.x.domain(vis.displayData.map(function(d){
            if(vis.selectedCategory === 'Year')
                return vis.parseDate(d[vis.selectedCategory]);
            else
                return d[vis.selectedCategory];
        }))
        // add bars using enter, update, exit methods
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.displayData, d=>d[vis.selectedCategory])
        vis.bars.exit().remove();

        vis.bars.enter().append("rect")
            .attr("class", "bar")
            .merge(vis.bars)
            .on('mouseover', function(event, d) {
                d3.select(this) // changes color of selected bar
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style("opacity", 1)
                    .style('fill', '#ffce01')
                vis.tooltip // adds tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="text-align: left; border: thin solid grey; border-radius: 5px; background: lightgrey; padding-top: 10px; padding-right: 10px; padding-left: 10px">
                         <h4>${vis.selectedCategory}: ${d[vis.selectedCategory]}</h4>
                         <p> Medals: ${d.medal_count}</p>
                     </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style("fill", '#555555')
                    .style("opacity", 1)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .on('click', function(event, d) {
                d3.select(this) // changes color of selected bar
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style("opacity", 1)
                    .style('fill', '#ffce01')
                selYear = d.Year
                console.log(selYear)
                treeVis.wrangleData()
            })
            .transition()
            .duration(1000)
            .attr("x", function(d){
                if(vis.selectedCategory === 'Year')
                    return vis.x(vis.parseDate(d[vis.selectedCategory]));
                else
                    return vis.x(d[vis.selectedCategory])
            })
            .attr("y", d=> vis.y(d.medal_count))
            .attr("width", vis.x.bandwidth())
            .attr("height", d=> vis.height - vis.y(d.medal_count))
            .style("fill", '#555555')


        // Call axis functions with the new domain

        vis.xAxisGroup
            .transition()
            .duration(1000)
            .call(vis.xAxis)
            .selectAll('text')
            .attr('x', '-0.5em')
            .attr('y', '0.2em')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-45)');
        vis.yAxisGroup
            .transition()
            .duration(1000)
            .call(vis.yAxis);


    }
}