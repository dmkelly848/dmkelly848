/* * * * * * * * * * * * * *
*      Dash Bar          *
* * * * * * * * * * * * * */

//Bars showing number of medals per year and event for selected country in dashboard
class DashBar {

    constructor(parentElement, resultsData, continentData, selectedCategory) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;
        this.selectedCategory = selectedCategory;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.colors = {
            'Africa': '#FF5F15',
            'Asia': '#179a13',
            'Europe': '#3e76ec',
            'North America': '#ff0000',
            'Oceania': '#702963',
            'South America': '#ffce01',
        }


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
            .attr('font-size', '70%')
            .attr('transform', `translate(${vis.width / 2}, ${vis.height / 10})`)
            .attr('text-anchor', 'middle');

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
            .scale(vis.y)

        // create axis groups
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis axisWhite")
            .attr("transform", "translate(0," + vis.height + ")");
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis axisWhite");

        // add tooltip area
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        vis.wrangleData()
    }


    //Collect data for number of medals by year and event for country
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
        vis.updateVis()
    }


    updateVis() {
        let vis = this;

        // update domains
        vis.y.domain([0, d3.max(vis.displayData, d=>d.medal_count)]);
        if(vis.selectedCategory === 'Year')
            vis.x.domain(d3.range(1896,2020,4).map(d=>vis.parseDate(d)))
        else
            vis.x.domain(vis.displayData.map(d=> d[vis.selectedCategory]))

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
                    .attr('stroke', 'white')
                    .style("opacity", 1)
                    .style('fill', '#f6a1d4')
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
                    .style("fill", function(){
                        if(selCountry !== 'Worldwide') {
                            return vis.colors[vis.continentData.find(d => d.Code === selCountry).Continent];
                        }
                        else
                            return '#707070';
                    })
                    .style("opacity", 1)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
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
            .style("fill", function(){
                if(selCountry != 'Worldwide') {
                    return vis.colors[vis.continentData.find(d => d.Code === selCountry).Continent];
                }
                else
                    return '#707070';
            });


        // Call axis functions with the new domain
        vis.xAxisGroup
            .transition()
            .duration(1000)
            .call(vis.xAxis)
            .selectAll('text')
            .attr('x', '-0.5em')
            .attr('y', '0.2em')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-45)')
            .attr('fill', 'white');
        vis.yAxisGroup
            .transition()
            .duration(1000)
            .call(vis.yAxis);


    }
}