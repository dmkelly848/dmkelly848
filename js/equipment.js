/* * * * * * * * * * * * * *
*      Equipment Vis          *
* * * * * * * * * * * * * */


//Concept: Clickable icons display info on Olympics equipment
//Note that this has no data, the text is hard-coded
class EquipmentVis {

    constructor(parentElement) {
        this.parentElement = parentElement;
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

        //"e1","e2",and "e3" correspond to running shoes, track material, and tracksuits, respectively

        vis.e1 = vis.svg.append("svg:image")
            .attr("xlink:href", `img/e1.png`)
            .attr("x",vis.width/4)
            .attr("y", vis.height/4-50)
            .attr('height', vis.width/3)
            .attr('width', vis.width/3)
            .on("mouseover",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 0.5)
            })
            .on("mouseout",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 1.0)
            })
            .on("click",function(event,d){
                document.getElementById("texte1b").innerHTML="The first spiked running shoes were not introduced until 1865. By the 1896 Olympics, the top running shoe was made of heavy leather, which continued until the leaner WWII years, when shoes were made of excess canvas and rubber. "
                document.getElementById("texte1a").innerHTML="Modern running shoes are feather-weight, coming in at under 100 grams. They are constructed from synthetic mesh fabric. Moreover the World Athletics association has imposed rules on the thicknesses and spike heights of running shoes, limiting future changes. "

            })



        vis.e2 = vis.svg.append("svg:image")
            .attr("xlink:href", `img/e2.png`)
            .attr("x",vis.width/4)
            .attr("y", vis.height/2-50)
            .attr('height', vis.width/4)
            .attr('width', vis.width/3)
            .on("mouseover",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 0.5)
            })
            .on("mouseout",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 1.0)
            }).on("click",function (event,d){

                document.getElementById("texte2b").innerHTML="In early Olympics, races were held on grass, dirt, or cinder. Synthetic rubber/asphalt materials were not introduced until the 1950s."
                document.getElementById("texte2a").innerHTML="The most recent Olympics track took three years of design and testing to build. It consists of two sheets of special vulcanized rubber, with a layer of honeycomb air cells in the middle to provide spring."

            })


        vis.e3 = vis.svg.append("svg:image")
            .attr("xlink:href", `img/e3.png`)
            .attr("x",vis.width/4 + 20)
            .attr("y", 3*vis.height/4-50)
            .attr('height', vis.width/4)
            .attr('width', vis.width/4)
            .on("mouseover",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 0.5)
            })
            .on("mouseout",function(event,d){
                d3.select(this) // changes color of selected bar
                    .style("opacity", 1.0)
            }).on("click",function(event,d){
                document.getElementById("texte3b").innerHTML="Sprinters and marathon runners commonly wore baggy (and non-aerodynamic!) track and field uniforms. Hemlines rose and fell as the style of the times changed"
                document.getElementById("texte3a").innerHTML="The modern tracksuit made of synthetic material gained popularity in the 1970s. At this point, sprinters focused on tight, aerodynamic clothing while marathon runners prioritized breathability."
            })
    }
}