/* * * * * * * * * * * * * *
*      CIRCLES Vis          *
* * * * * * * * * * * * * */

class CircleVis {

    constructor(parentElement, resultsData, circleData, type) {
        this.parentElement = parentElement;
        this.circleData = circleData;
        this.resultsData = resultsData;
        this.type = type;
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 30, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        //define type-dependent variables
        let circsPerRow;
        let color;
        if(vis.type===1) {
            circsPerRow = 9;
            color = 'lightblue'
            // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
            vis.circleData = [...new Set(vis.resultsData.map(d => d.Event))];
            console.log(vis.circleData)
        }
        else{
            circsPerRow = 3;
            color = 'red'
        }
        let r = vis.width/(circsPerRow*2*2)


        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.circles = vis.svg.selectAll(".reason").data(vis.circleData)
        vis.circles.enter().append("circle")
            .attr("cx",function(d,i){
                return (i%circsPerRow * vis.width/circsPerRow) + 2*r;
            })
            .attr("cy",function (d,i){
                return (Math.floor(i/circsPerRow) * 3 * r) + r;
            })
            .attr("r",r)
            .attr("fill",color)

        vis.labels = vis.svg.selectAll(".labs").data(vis.circleData)
        vis.labels.enter().append("text")
            .attr("class","olympicHeadText")
            .attr("x",function (d,i){
                return (i%circsPerRow * vis.width/circsPerRow) + 2*r;
            })
            .attr("y", function(d,i){
                return (Math.floor(i/circsPerRow) * 3 * r) + r;
            })
            .attr("text-anchor","middle")
            .text(d=> d);


        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;


    }




}