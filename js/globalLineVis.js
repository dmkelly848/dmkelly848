/* * * * * * * * * * * * * *
*      Global Access Line Vis          *
* * * * * * * * * * * * * */

//Concept: This is a bar chart in the "global access" reasons tab
//It shows how diversity on Olympic teams has changed since 1960
class GlobalLineVis {

    constructor(parentElement) {
        this.parentElement = parentElement;
        this.formatDate = d3.timeFormat("%Y");
        this.state = 0;
        this.colorScale = ['#ff0000','#3e76ec']

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 50, right: 40, bottom: 100, left: 30};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.groups = ["Argentina","Canada","France","Great Britain","Sweden","United States"]
        vis.subgroups = ["Yr1960","Yr2012"]


        vis.VERTSHIFT = 70;

        // Scales and Axes
        vis.y = d3.scaleLinear().domain([0,1])
            .range([vis.height,vis.VERTSHIFT]);

        vis.x0 = d3.scaleBand()
            .domain(vis.groups)
            .range([0,vis.width])
            .padding([0.2]);

        //Second x-scale used to place bars within the same category
        vis.x1 = d3.scaleBand().domain(["Yr1960","Yr2012"])
            .range([0, vis.x0.bandwidth()])
            .padding([0.05])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x0)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.svg.append("g")
            .attr("class", "y-axis axis axisText olympicBodyText");

        vis.svg.append("g")
            .attr("class", "x-axis axis axisText olympicBodyText")
            .attr("transform", "translate(0," + vis.height+ ")");

        vis.color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#ff0000','#3e76ec'])

        //Labels
        vis.svg.append("text").text("Diversity among Foreign-Born Athletes")
            .attr("class","olympicHeadText")
            .attr("x",vis.width/4).attr("font-size","4vh")
        vis.svg.append("text").text("(1 indicates maximum diversity)")
            .attr("class","olympicBodyText")
            .attr("x",vis.width/3).attr("y","4vh").attr("font-size","3vh")

        //Tooltip for interactivity
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')

        vis.wrangleData()
    }

    //Data is hard coded, see below
    wrangleData() {
        let vis = this;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //Hard-coded data used for paired bars
        vis.data = [{group:"Argentina",Yr1960: 0.444, Yr2012:0.625},{group:"Canada",Yr1960: 0.898, Yr2012:0.924},
            {group:"France",Yr1960: 0.730, Yr2012:0.911},{group:"Great Britain",Yr1960: 0.898, Yr2012:0.949},
            {group:"Sweden",Yr1960: 0.667, Yr2012:0.750},{group:"United States",Yr1960: 0.860, Yr2012:0.962}]

        //Interactive bar visualization
        vis.svg.append("g")
            .selectAll("g")
            .data(vis.data)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + vis.x0(d.group) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return vis.subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return vis.x1(d.key); })
            .attr("y", function(d) { return vis.y(d.value); })
            .attr("width", vis.x1.bandwidth())
            .attr("height", function(d) { return vis.height - vis.y(d.value); })
            .attr("fill", function(d) { return vis.color(d.key); })
            .on('mouseover', function(event, d,i){
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
             <h3 class="olympicHeadText">${d.key.substring(2,6)}<h3>
             <h4 class="olympicBodyText"> Diversity Score: ${d.value}</h4>      
         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", function(d) { return vis.color(d.key); })
                    .attr("opacity",1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        //Legend info
        vis.legendKeys = ["1960","2012"]
        let lineLegend = vis.svg.selectAll(".lineLegend").data(vis.legendKeys)
            .enter().append("g")
            .attr("class","lineLegend")
            .attr("transform", function (d,i) {
                let shift =i*20 +vis.height/8
                return "translate(" + vis.width/10 + "," + shift+")";
            });

        lineLegend.append("text").text(function (d) {return d;})
            .attr("transform", "translate(15,9)")
            .attr("class","axisText"); //align texts with boxes

        lineLegend.append("rect")
            .attr("fill", function (d, i) {return vis.colorScale[i]; })
            .attr("width", 10).attr("height", 10);

        //Calling axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}