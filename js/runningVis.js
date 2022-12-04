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
        vis.margin = {top: 75, right: 100, bottom: 15, left: 100};
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

        vis.svg.append('line')
            .attr('x1',35)
            .attr('x2',35)
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','black')
            .attr('stroke-width', 3)

        vis.svg.append('line')
            .attr('x1',vis.width - 100)
            .attr('x2',vis.width - 100)
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','black')
            .attr('stroke-width', 3)

        vis.svg.append('line')
            .attr('x1',35 + .25 * (vis.width - 135))
            .attr('x2',35 + .25 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('line')
            .attr('x1',35 + .5 * (vis.width - 135))
            .attr('x2',35 + .5 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('line')
            .attr('x1',35 + .75 * (vis.width - 135))
            .attr('x2',35 + .75 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',35)
            .attr('y',-10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('START')

        // vis.svg.append('text')
        //     .attr('class', 'meter-label')
        //     .attr('x',35 + .25 * (vis.width - 135))
        //     .attr('y',-10)
        //     .attr('fill','black')
        //     .attr("text-anchor","middle")
        //     .text('25')
        //
        // vis.svg.append('text')
        //     .attr('class', 'meter-label')
        //     .attr('x',35 + .5 * (vis.width - 135))
        //     .attr('y',-10)
        //     .attr('fill','black')
        //     .attr("text-anchor","middle")
        //     .text('50')
        //
        // vis.svg.append('text')
        //     .attr('class', 'meter-label')
        //     .attr('x',35 + .75 * (vis.width - 135))
        //     .attr('y',-10)
        //     .attr('fill','black')
        //     .attr("text-anchor","middle")
        //     .text('75')

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',vis.width - 100)
            .attr('y', -10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('FINISH')

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.selectedgender = d3.select("#running-gender").property("value")

        vis.displayData = vis.resultsData.filter((d) => {
            return (d.Event === '100M' && d.Medal === 'G' && d.Gender === vis.selectedgender);
        })

        vis.displayData.sort((a,b)=> a.Year - b.Year);

        //vis.updateVis()
    }



    updateVis() {
        let vis = this;

        vis.x.domain([0,vis.width])
        vis.y.domain(vis.displayData.map(function(d) {//console.log(d[""])
            return d[""]; }))

        let bars = vis.svg.selectAll(".running-bar")
            .data(vis.displayData);

        bars.exit().remove()

        bars.enter().append("rect")
            .attr("class", "running-bar")
            .merge(bars)
            .attr("x", 35)
            .attr("y", d => vis.y(d[""]))
            .attr("width", 0)
            .attr("height", vis.y.bandwidth())
            .transition()
            // https://www.d3indepth.com/transitions/
            .ease(d3.easeLinear)
            .duration(function(d) {
                return 1000 * d.Clean_Result;
            })
            .attr("width", d => vis.width - 135)
            .attr("fill", "blue")

        let startgates = vis.svg.selectAll(".gate")
            .data(vis.displayData);

        startgates.exit().remove()

        startgates.enter().append("rect")
            .attr("class", "gate")
            .merge(startgates)
            .attr("x", 0)
            .attr("y", d => vis.y(d[""]))
            .attr("width", 35)
            .attr("height", vis.y.bandwidth())
            .attr("fill", "blue")

        let year_labels = vis.svg.selectAll(".year-label")
            .data(vis.displayData)

        year_labels.exit().remove()

        year_labels.enter().append("text")
            .attr("class","year-label")
            .merge(year_labels)
            .attr("fill", "white")
            .attr("y", function(d) {
                if (d.Gender ==='M'){
                    return vis.y(d[""]) + 10
                }
                if (d.Gender === 'W'){
                    return vis.y(d[""]) + 12
                }
            })
            .attr("x", 5)
            .attr("text-anchor","begin")
            .text(d => vis.formatDate(d.Year))

        let time_labels = vis.svg.selectAll(".time-label")
            .data(vis.displayData)

        time_labels.exit().remove()

        time_labels.enter().append("text")
            .attr("class","time-label")
            .merge(time_labels)
            .attr("fill", "black")
            .attr("y", d => vis.y(d[""]) + 12)
            .attr("x", vis.width - 95)
            .attr("text-anchor","begin")
            .text("")
            .transition()
            // https://www.d3indepth.com/transitions/
            .delay(function(d) {
                return 1000 * d.Clean_Result;
            })
            .text(d => d.Clean_Result)

        let player_labels = vis.svg.selectAll(".player-label")
            .data(vis.displayData)

        player_labels.exit().remove()

        player_labels.enter().append("text")
            .attr("class","player-label")
            .merge(player_labels)
            .attr("fill", "black")
            .attr("y", d => vis.y(d[""]) + 12)
            .attr("x", vis.width - 60)
            .attr("text-anchor","begin")
            .text("")
            .transition()
            // https://www.d3indepth.com/transitions/
            .delay(function(d) {
                return 1000 * d.Clean_Result;
            })
            .text(d => d.Name)


        vis.svg.selectAll('text').exit().remove()
        vis.svg.selectAll('.meter-line').remove()

        vis.svg.append('line')
            .attr('x1',35)
            .attr('x2',35)
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','black')
            .attr('stroke-width', 3)

        vis.svg.append('line')
            .attr('x1',vis.width - 100)
            .attr('x2',vis.width - 100)
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','black')
            .attr('stroke-width', 3)

        vis.svg.append('line')
            .attr('x1',35 + .25 * (vis.width - 135))
            .attr('x2',35 + .25 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('line')
            .attr('x1',35 + .5 * (vis.width - 135))
            .attr('x2',35 + .5 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('line')
            .attr('x1',35 + .75 * (vis.width - 135))
            .attr('x2',35 + .75 * (vis.width - 135))
            .attr('y1',0)
            .attr('y2',vis.height)
            .attr('class','meter-line')
            .attr('stroke','white')
            .attr('stroke-width', 1)

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',35)
            .attr('y',-10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('START')

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',35 + .25 * (vis.width - 135))
            .attr('y',-10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('25')

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',35 + .5 * (vis.width - 135))
            .attr('y',-10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('50')

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',35 + .75 * (vis.width - 135))
            .attr('y',-10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('75')

        vis.svg.append('text')
            .attr('class', 'meter-label')
            .attr('x',vis.width - 100)
            .attr('y', -10)
            .attr('fill','black')
            .attr("text-anchor","middle")
            .text('FINISH')
    }
}
