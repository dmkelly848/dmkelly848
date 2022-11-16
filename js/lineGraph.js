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
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
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
        vis.x = d3.scaleLinear()
            .range([0,vis.width]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height+ ")");


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



        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        function calculate(array) {
            return array.reduce((a, b) => a + b) / array.length;
        }

        vis.line = vis.svg.append("path")
            .data(vis.javelinData)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Year)  })
                .y(function(d) { return vis.y(calculate(d.Clean_Result)) })
            )
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3.0);

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