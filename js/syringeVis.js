/* * * * * * * * * * * * * *
*      Syringe Vis          *
* * * * * * * * * * * * * */

class SyringeVis {

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


        vis.outline = vis.svg.append("path")
            .attr("d","M 201.6 627 L 235.2 759 L 268.8 627 L 336 627 V 209 H 134.4 V 627 M 201.6 209 V 165 H 268.8 V 209 Z M 201.6 165 C 168 143 100.8 165 100.8 121 C 134.4 99 201.6 99 235.2 99 C 268.8 99 336 99 369.6 121 C 369.6 165 302.4 143 268.8 165 M 134 626 L 200 625")
            .attr("stroke","black")
            .attr("stroke-width",5)
            .attr("fill","none");


        vis.tipFill = vis.svg.append("path")
            .attr("d","M 200 626 L 269 626 L 235 757 L 202 626")
            .attr("fill","gray");

        let BUFFER = vis.width/20



        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;
        console.log(vis.state)
        vis.fill = vis.svg.selectAll(".fillLiquid")
        vis.fill = vis.svg.append("path").merge("vis.fill").transition().duration(1000)
            .attr("class","fillLiquid")
            .attr("d", function(d, index) {
                if(vis.state === 0){
                    return '';
                }else if (vis.state === 1){
                    console.log("yes")
                    return ' M 132 626 L 334 627 L 335 501 C 235 467 203 533 137 500 L 136 624'
                }
            })
            .attr("fill", "green");

    }


    fillUp(){
        let vis = this;
        if(vis.state!==4){
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