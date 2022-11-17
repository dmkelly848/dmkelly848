/* * * * * * * * * * * * * *
*      LineGraph Vis          *
* * * * * * * * * * * * * */

class LineGraph {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");
        this.state = 0;

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // add scale + axis
        vis.y = d3.scaleLinear()
            .range([vis.height,0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        // add scale + axis
        vis.x = d3.scaleTime()
            .range([0,vis.width]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.svg.append("g")
            .attr("class", "y-axis axis axisText");

        vis.svg.append("g")
            .attr("class", "x-axis axis axisText")
            .attr("transform", "translate(0," + vis.height+ ")");

        vis.area = vis.svg.append("rect")

        vis.group = vis.svg.append("g")
            .attr("x",0)
            .attr("y",0)
            .attr("id", "tool");

        vis.hoverL = vis.group
            .append("line")
            .attr("stroke", "#000000")
            .attr("stroke-dasharray","4 1 2 3")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", 0).attr("y2", vis.height);

        vis.hoverR = vis.group
            .append("line")
            .attr("stroke", "#000000")
            .attr("stroke-dasharray","4 1 2 3")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", 0).attr("y2", vis.height);


        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;
        console.log(vis.resultsData)

        let filterGenderDat = vis.resultsData.filter(function (d){
            return (d.Gender === 'M')
        });


        vis.discusData = [];
        vis.javelinData = [];
        vis.hammerData = [];

        // get only  jump results
        filterGenderDat.forEach((element) => {
            if(element.Event === 'Javelin Throw'){
                vis.javelinData.push(element);
            }else if(element.Event === 'Hammer Throw'){
                vis.hammerData.push(element);
            }else if(element.Event === 'Discus Throw') {
                vis.discusData.push(element);
            }
        })


        let javTemp = d3.rollup(vis.javelinData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        let disTemp = d3.rollup(vis.discusData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        let hamTemp = d3.rollup(vis.hammerData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        vis.javelinData = Array.from(javTemp).map(([key, value]) => ({key, value}));
        vis.discusData = Array.from(disTemp).map(([key, value]) => ({key, value}));
        vis.hammerData = Array.from(hamTemp).map(([key, value]) => ({key, value}))





        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        let max = Math.max(d3.max(vis.javelinData, d => d.value))


        vis.y.domain([0, max+0.5]);

        vis.x.domain([d3.min(vis.discusData, d=>d.key),d3.max(vis.discusData, d=>d.key)])

        let p1 = vis.x(new Date(1898,1,1))
        let p2 = vis.x(new Date(1952,1,1))
        let p3 = vis.x(new Date(1972,1,1))
        let p4 = vis.x(new Date(1988,1,1))
        let p5 = vis.x(new Date(2014),1,1)
        console.log(p3)
        vis.hoverR.attr("x1",p1).attr("x2",p1)
        vis.hoverR.attr("x1",p2).attr("x2",p2)


        vis.line1 = vis.svg.append("path")
            .datum(vis.javelinData)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.key)  })
                .y(function(d) { return vis.y((d.value))})
            )
            .attr("fill","none")
            .attr("stroke", "#ff0000")
            .attr("stroke-width", 5.0);

        vis.line2 = vis.svg.append("path")
            .datum(vis.discusData)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.key)  })
                .y(function(d) { return vis.y((d.value))})
            )
            .attr("fill","none")
            .attr("stroke", "#179a13")
            .attr("stroke-width", 5.0);

        vis.line3 = vis.svg.append("path")
            .datum(vis.hammerData)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.key)  })
                .y(function(d) { return vis.y((d.value))})
            )
            .attr("fill","none")
            .attr("stroke", "#3e76ec")
            .attr("stroke-width", 5.0);


        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

    }

    fillUp(){
        let vis = this;
        if(vis.state!==3){
            vis.state++;
        }

    }

    emptyDown(){
        let vis = this;
        if(vis.state !== 0){
            vis.state--;
        }
    }




}