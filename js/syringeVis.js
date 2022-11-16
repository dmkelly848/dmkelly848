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


        vis.svg.append("path")
            .attr("d","M 337 500 L 289 500")
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d","M 337 400 L 289 400")
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d","M 337 300 L 289 300")
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d","M 337 600 L 289 600")
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.tipFill = vis.svg.append("path")
            .attr("d","M 200 626 L 269 626 L 235 757 L 202 626")
            .attr("fill","gray");


        vis.fillVial = vis.svg.append("path")
            .attr("class","fillLiquid")
            .attr("d", '')
            .attr("fill", "green");

        document.getElementById("text0").innerHTML= "1962: Athletes begin using stimulants that gained prevalence during WWII.";

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;
        vis.fillVial.transition().ease(d3.easeLinear).duration(800)
            .attr("d", function(d, index) {
                if(vis.state === 0){
                    return 'M 132 626 L 334 627 L 338 612 C 198 620 224 608 132 612 L 136 624';
                }else if (vis.state === 1){
                    return ' M 132 626 L 334 627 L 335 501 C 235 467 203 533 137 500 L 136 624';
                }else if(vis.state === 2){
                    return 'M 132 626 L 334 627 L 337 403 C 235 467 244 320 136 393 L 136 624';
                }else if(vis.state === 3){
                    return 'M 132 626 L 334 627 L 337 228 C 265 243 198 222 133 232 L 136 624';
                }
            })
            .attr("fill", "green")
            .attr("fill-opacity",0.5)

    }


    fillUp(){
        let vis = this;
        if(vis.state!==3){
            vis.state++;
            if(vis.state ===1){
                document.getElementById("text1").innerHTML= "1972: First large-scale testing of stimulants at the Olympics.\n";
            }else if(vis.state ===2){
                document.getElementById("text2").innerHTML= "1988: Sprinter Ben Johnson is caught doping in the most “infamous” case of Olympics drug usage.\n";
            }else if(vis.state ===3){
                document.getElementById("text3").innerHTML= "2014: Russian scandal makes doping a national issue.\n";
            }
        }


    }

    emptyDown(){
        let vis = this;
        if(vis.state !== 0){
            vis.state--;
            if(vis.state === 0){
                document.getElementById("text1").innerHTML= "";
            }else if(vis.state ===1){
                document.getElementById("text2").innerHTML= "";
            }else if(vis.state ===2) {
                document.getElementById("text3").innerHTML = "";
            }
        }
    }

}