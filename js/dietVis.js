/* * * * * * * * * * * * * *
*      Diet Vis          *
* * * * * * * * * * * * * */


dietData = [{type: "Carbohydrates",percent:55,color:"#ff0000",examples:"Vegetables, fruits, and whole grains"},
    {type: "Lean Proteins",percent:20,color:"#3e76ec",examples: "Fish, poultry, beans, and low-fat dairy"},
    {type:"High-Quality Fats",percent:25,color:"#ffce01",examples: "Olive oil, nuts, seeds, and avocados"}]

class DietVis {

    constructor(parentElement) {
        this.parentElement = parentElement;
        this.resultsData = dietData;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

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

        vis.innerCirc = vis.svg.append("circle")
            .attr("r",0.8*vis.width/2)
            .attr("cx",vis.center.x)
            .attr("cy",vis.center.y)
            .attr("fill","none")
            .attr("stroke","black")

        vis.outerCirc = vis.svg.append("circle")
            .attr("r",0.9*vis.width/2)
            .attr("cx",vis.center.x)
            .attr("cy",vis.center.y)
            .attr("fill","none")
            .attr("stroke","gray")


        // add title
        vis.svg.append('g')
            .attr('class', 'h3 olympicHeadText')
            .append('text')
            .text('Olympic Athletes Caloric Breakdown')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle')
            .attr('font-size','4vh');


        // TODO
        vis.pieChartGroup = vis.svg
            .append('g')
            .attr('class', 'pie-chart')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')
        // Pie chart settings
        vis.outerRadius = 0.8*vis.width / 2;
        vis.innerRadius = 0;


        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // Define a default pie layout
        let pie = d3.pie();

        // Path generator for the pie segments
        let arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

// Bind data
        let arcs = vis.pieChartGroup.selectAll(".arc")
            .data(pie(vis.resultsData.map(d=>d.percent)));

// Append paths
        arcs.enter()
            .append("path").merge(arcs)
            .attr("d", arc)
            .style("fill", function(d, index) { return vis.resultsData[index].color; })
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr("opacity",0.5)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
             <h3 class="olympicHeadText">${vis.resultsData[d.index].type}<h3>
             <h4 class="olympicBodyText"> Percentage of Daily Calories: ${d.data}%</h4>      
             <h4 class="olympicBodyText"> Examples: ${vis.resultsData[d.index].examples}</h4>                         
         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => d.data.color)
                    .attr("opacity",1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

    }



}