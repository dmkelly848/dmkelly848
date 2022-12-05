class RecordsLineVis {

    constructor(parentElement, data, records, hostData, countryData) {
        this.parentElement = parentElement;
        this.data = data;
        this.records = records;
        this.hostData = hostData;
        this.countryData= countryData;

        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.colors = ['#ADDEFF','#ffb0af','#3e76ec','#FF5F15']

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

        // creating scales for barplot: scalelinear and scaleband, and creating axis
        vis.x = d3.scaleLinear()
            .domain([1896,2016])
            .range([.02 * vis.width, vis.width * .9])

        vis.xAxis = d3.axisTop()
            .scale(vis.x)
            .tickValues(d3.range(1896,2020,4))
            //https://stackoverflow.com/questions/16549868/d3-remove-comma-delimiters-for-thousands
            .tickFormat(d3.format("d"))
            .ticks()

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis axisWhite")
            .attr("transform", "translate(0," + vis.height * .05 + ")");

        vis.xAxisGroup
            .call(vis.xAxis)
            .selectAll('text')
            .attr('text-anchor', 'middle')
            .attr("transform", "translate(0," + 1 + ")");

        vis.y = d3.scaleBand()
            .domain(vis.records.map(d => d.Competition))
            .range([.08 * vis.height,.98 * vis.height])
            .paddingInner(.8)

        // creating tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'recordsTooltip')

        vis.svg.append('circle')
            .attr('cy',vis.height * .85)
            .attr('cx',vis.width * .02)
            .attr('r', 5)
            .attr('fill', vis.colors[0])

        vis.svg.append('circle')
            .attr('cy',vis.height * .85 + 15)
            .attr('cx',vis.width * .02)
            .attr('r', 5)
            .attr('fill', vis.colors[2])

        vis.svg.append('circle')
            .attr('cy',vis.height * .85 + 30)
            .attr('cx',vis.width * .02)
            .attr('r', 5)
            .attr('fill', vis.colors[1])

        vis.svg.append('circle')
            .attr('cy',vis.height * .85 + 45)
            .attr('cx',vis.width * .02)
            .attr('r', 5)
            .attr('fill', vis.colors[3])

        vis.svg.append('text')
            .attr('class', 'legend-text')
            .attr('y',vis.height * .85 + 4)
            .attr('x',vis.width * .02 + 7)
            .attr('r', 5)
            .attr('fill', vis.colors[0])
            .text('Existing Men\'s Record')

        vis.svg.append('text')
            .attr('class', 'legend-text')
            .attr('y',vis.height * .85 + 19)
            .attr('x',vis.width * .02 + 7)
            .attr('r', 5)
            .attr('fill', vis.colors[2])
            .text('New Men\'s Record')

        vis.svg.append('text')
            .attr('class', 'legend-text')
            .attr('y',vis.height * .85 + 34)
            .attr('x',vis.width * .02 + 7)
            .attr('r', 5)
            .attr('fill', vis.colors[1])
            .text('Existing Women\'s Record')

        vis.svg.append('text')
            .attr('class', 'legend-text')
            .attr('y',vis.height * .85 + 49)
            .attr('x',vis.width * .02 + 7)
            .attr('r', 5)
            .attr('fill', vis.colors[3])
            .text('New Women\'s Record')

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
        vis.lines = vis.svg.selectAll('.record-line').data(vis.displayData)

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
            })
            // adding tooltip to lines
            .on('mouseover', function(event, d){

                console.log(d)

                // https://www.digitalocean.com/community/tutorials/how-to-work-with-strings-in-javascript
                if (d.Gender === 'M'){
                    vis.tooltipGender = 'Men\'s'
                }
                if (d.Gender === 'W'){
                    vis.tooltipGender = 'Women\'s'
                }

                vis.recordEvent = vis.data.filter(function (e) {
                    return (d.Set === vis.formatDate(e.Year) && e.Event === d.Event && e.Medal === 'G' && e.Gender === d.Gender)
                });

                //read in additional attributes of record
                vis.recordBreakerName = vis.recordEvent[0].Name
                vis.recordBreakerNationality = vis.countryData.find(d => d.Code === vis.recordEvent[0].Nationality).Country

                if (vis.recordEvent[0].Event === '4X100M Relay'){
                    vis.recordBreakerName = 'Team ' +  vis.recordBreakerNationality
                }

                if (vis.recordEvent[0].Event === '4X400M Relay'){
                    vis.recordBreakerName = 'Team ' +  vis.recordBreakerNationality
                }

                vis.recordBreakerMark = vis.recordEvent[0].Result

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h4><b><u>${vis.tooltipGender + ' ' + d.Event}</u></b><h4>
                        <h4>${'Mark: ' + vis.recordBreakerMark}</h4>         
                        <h4>${'By: ' + vis.recordBreakerName}</h4>
                        <h4>${'Nationality: ' + vis.recordBreakerNationality}</h4>
                        <h4>${'Record Set: ' + d.Set}</h4>                  
                        </div>`);
            }).on('mouseout', function(event, d){

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })


        // enter-update-exit on circles
        vis.circles = vis.svg.selectAll(`.circle`).data(vis.displayData)

        vis.circles.exit().remove()

        vis.circles.enter().append("circle")
            .attr('class', `circle`)
            .merge(vis.circles)
            .attr("cx", d=> vis.x(d.Set))
            .attr("cy", d=> vis.y(d.Competition) + vis.y.bandwidth()/2)
            .attr("r", 2 * vis.y.bandwidth())
            .attr("fill", function(d){
                if (d.Gender === 'M' && d.Set !== vis.hostData[mapYearIndex].Year){
                    return vis.colors[0]
                }
                if (d.Gender === 'W' && d.Set !== vis.hostData[mapYearIndex].Year){
                    return vis.colors[1]
                }
                if (d.Gender === 'M' && d.Set === vis.hostData[mapYearIndex].Year){
                    return vis.colors[2]
                }
                if (d.Gender === 'W' && d.Set === vis.hostData[mapYearIndex].Year){
                    return vis.colors[3]
                }
            })
            // adding tooltip to circles
            .on('mouseover', function(event, d){

                console.log(d)

                // https://www.digitalocean.com/community/tutorials/how-to-work-with-strings-in-javascript
                if (d.Gender === 'M'){
                    vis.tooltipGender = 'Men\'s'
                }
                if (d.Gender === 'W'){
                    vis.tooltipGender = 'Women\'s'
                }

                vis.recordEvent = vis.data.filter(function (e) {
                    return (d.Set === vis.formatDate(e.Year) && e.Event === d.Event && e.Medal === 'G' && e.Gender === d.Gender)
                });

                //read in additional attributes of record
                vis.recordBreakerName = vis.recordEvent[0].Name
                vis.recordBreakerNationality = vis.countryData.find(d => d.Code === vis.recordEvent[0].Nationality).Country

                if (vis.recordEvent[0].Event === '4X100M Relay'){
                    vis.recordBreakerName = 'Team ' +  vis.recordBreakerNationality
                }

                if (vis.recordEvent[0].Event === '4X400M Relay'){
                    vis.recordBreakerName = 'Team ' +  vis.recordBreakerNationality
                }

                vis.recordBreakerMark = vis.recordEvent[0].Result

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h4><b><u>${vis.tooltipGender + ' ' + d.Event}</u></b><h4>
                        <h4>${'Mark: ' + vis.recordBreakerMark}</h4>         
                        <h4>${'By: ' + vis.recordBreakerName}</h4>
                        <h4>${'Nationality: ' + vis.recordBreakerNationality}</h4>
                        <h4>${'Record Set: ' + d.Set}</h4>                  
                        </div>`);
            }).on('mouseout', function(event, d){

            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })

        // enter-update-exit on event names
        vis.eventnames = vis.svg.selectAll(`.event-name`).data(vis.displayData)

        vis.eventnames.exit().remove()

        vis.eventnames.enter().append("text")
            .attr('class', `event-name`)
            .merge(vis.eventnames)
            .attr("x", vis.x(vis.hostData[mapYearIndex].Year) + 5)
            .attr("y", d=> vis.y(d.Competition) + 2.5 * vis.y.bandwidth())
            .attr('fill','white')
            .text(d=>d.Competition)
    }

}