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

        let sF = 140000/(vis.width*vis.height);
        let pathMain = "M " + 201.6*sF + " " + 627*sF + " L " + 235.2*sF + " "+ 759*sF + " L " + 268.8*sF + " " + 627*sF + " L "+
            336*sF + " " + 627*sF + " V " + 209*sF + " H " + 134.4*sF + " V " + 627*sF + " M " + 201.6*sF + " " + 209*sF + " V " +
            165*sF + " H " + 268.8*sF + " V " + 209*sF + " Z M " + 201.6*sF + " " + 165*sF + " C " + 168*sF + " " + 143*sF + " " +
            100.8*sF + " " + 165*sF + " " + 100.8*sF + " " + 121*sF + " C " + 134.4*sF + " " + 99*sF + " " + 201.6*sF + " " + 99*sF + " " + 235.2*sF + " " + 99*sF +
            " C " + 268.8*sF + " " + 99*sF + " " + 336*sF + " " + 99*sF + " " + 369.6*sF + " " + 121*sF + " C " + 369.6*sF + " " +
            165*sF + " " + 302.4*sF + " " + 143*sF + " " + 268.8*sF + " " + 165*sF + " M " + 134*sF + " " + 626*sF + " L " + 200*sF + " " + 625*sF;


        vis.outline = vis.svg.append("path")
            .attr("d",pathMain)
            .attr("stroke","black")
            .attr("stroke-width",5)
            .attr("fill","none");

        let tick1 = "M " + 337*sF + " " + 500*sF + " L " + 289*sF + " " + 500*sF;
        let tick2 = "M " + 337*sF + " " + 400*sF + " L " + 289*sF + " " + 400*sF;
        let tick3 = "M " + 337*sF + " " + 300*sF + " L " + 289*sF + " " + 300*sF;
        let tick4 = "M " + 337*sF + " " + 600*sF + " L " + 289*sF + " " + 600*sF;
        vis.svg.append("path")
            .attr("d",tick1)
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d",tick2)
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d",tick3)
            .attr("stroke","black")
            .attr("stroke-width",5)

        vis.svg.append("path")
            .attr("d",tick4)
            .attr("stroke","black")
            .attr("stroke-width",5)

        let fill1 = "M " + 200*sF + " " + 626*sF + " L " + 269*sF + " " + 626*sF + " L " + 235*sF + " " + 757*sF + " L " + 202*sF + " " + 626*sF;

        vis.tipFill = vis.svg.append("path")
            .attr("d",fill1)
            .attr("fill","gray");


        vis.fillVial = vis.svg.append("path")
            .attr("class","fillLiquid")
            .attr("d", '')
            .attr("fill", "green");

        document.getElementById("text0").innerHTML= "<span class = \"olympicHeadText chartTitle\">1952:</span> Athletes begin using stimulants that gained prevalence during WWII.";

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;
        let sF = 140000/(vis.width*vis.height);
        vis.fillVial.transition().ease(d3.easeLinear).duration(800)
            .attr("d", function(d, index) {
                if(vis.state === 0){
                    return 'M ' + 132*sF + " " + 626*sF + " L " + 334*sF + " " + 627*sF + " L " +
                        338*sF +" " +612*sF + " C "+ 198*sF + " " + 620*sF + " " +
                        224*sF + " "+ 608*sF + " "+ 132*sF + " " + 612*sF + " L " + 136*sF + " " + 624*sF;
                }else if (vis.state === 1){
                    return 'M ' + 132*sF + " " + 626*sF + " L " + 334*sF + " " + 627*sF + " L " +
                        335*sF +" " +501*sF + " C "+ 235*sF + " " + 467*sF + " " +
                        203*sF + " "+ 533*sF + " "+ 137*sF + " " + 500*sF + " L " + 136*sF + " " + 624*sF;
                    //return ' M 132 626 L 334 627 L 335 501 C 235 467 203 533 137 500 L 136 624';
                }else if(vis.state === 2){
                    return 'M ' + 132*sF + " " + 626*sF + " L " + 334*sF + " " + 627*sF + " L " +
                        337*sF +" " +403*sF + " C "+ 235*sF + " " + 467*sF + " " +
                        244*sF + " "+ 320*sF + " "+ 136*sF + " " + 393*sF + " L " + 136*sF + " " + 624*sF;
                    //return 'M 132 626 L 334 627 L 337 403 C 235 467 244 320 136 393 L 136 624';
                }else if(vis.state === 3){
                    return 'M ' + 132*sF + " " + 626*sF + " L " + 334*sF + " " + 627*sF + " L " +
                        337*sF +" " +228*sF + " C "+ 265*sF + " " + 243*sF + " " +
                        198*sF + " "+ 222*sF + " "+ 133*sF + " " + 232*sF + " L " + 136*sF + " " + 624*sF;
                    //return 'M 132 626 L 334 627 L 337 228 C 265 243 198 222 133 232 L 136 624';
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
                document.getElementById("text1").innerHTML= "<span class = \"olympicHeadText chartTitle\">1972:</span> First large-scale testing of stimulants at the Olympics.\n";
            }else if(vis.state ===2){
                document.getElementById("text2").innerHTML= "<span class = \"olympicHeadText chartTitle\">1988:</span> Sprinter Ben Johnson is caught doping in the most “infamous” case of Olympics drug usage.\n";
            }else if(vis.state ===3){
                document.getElementById("text3").innerHTML= "<span class = \"olympicHeadText chartTitle\">2014:</span> Russian scandal makes doping a national issue.\n";
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