class RecordsLineVis {

    constructor(parentElement, data, records, hostData) {
        this.parentElement = parentElement;
        this.data = data;
        this.records = records;
        this.hostData = hostData;

        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 10, bottom: 20, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.circsPerRow = 30;
        vis.padfact = 1.2;
        vis.color = ['#3e76ec','#78ff44']
        vis.opacity = 0.35;
        vis.fontsize = 'small';
        vis.rfact = 1.3;
        vis.r = 10

        vis.x = d3.scaleLinear()
            .domain([1896,2017])
            .range([0, vis.width])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(30)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height * .90 + ")");

        vis.xAxisGroup
            .call(vis.xAxis)
            .selectAll('text')
            .attr('x', '-0.5em')
            .attr('y', '0.2em')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-45)')

        console.log("vis height")
        console.log(vis.height)

        vis.displayData = vis.records

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        vis.chosenYear = vis.parseDate(vis.hostData[mapYearIndex].Year)

        vis.circleData = vis.displayData.filter(function (d) {
            return (d['Set'] === vis.formatDate(vis.chosenYear))
        });


        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.circles = vis.svg.selectAll(`circle`).data(vis.circleData)

        vis.circles.exit().remove()

        vis.circles.enter().append("circle")
            .attr('class', `circle`)
            .merge(vis.circles)
            .attr("cx", function (d, i) {
                return (i % vis.circsPerRow * vis.width / vis.circsPerRow) + vis.padfact * vis.r;
            })
            .attr("cy", function (d, i) {
                return (Math.floor(i / vis.circsPerRow) * (vis.padfact + 1) * vis.r) + vis.r;
            })
            .attr("r", vis.r)
            .style('opacity', vis.opacity)
            .attr("fill", function(d){
                if (d.Gender === 'M'){
                    return vis.color[0]
                }
                if (d.Gender === 'W'){
                    return vis.color[1]
                }
            });

        vis.icons = vis.svg.selectAll(".icon").data(vis.circleData)

        vis.icons.exit().remove()

        vis.icons.enter().append("svg:image")
            .merge(vis.icons)
            .attr("xlink:href", d=>`img/icons/${d.Event}.png`)
            .attr("x",function (d,i){
                return (i%vis.circsPerRow * vis.width/vis.circsPerRow) + vis.padfact*vis.r - vis.r*2/3;
            })
            .attr("y", function(d,i){
                return (Math.floor(i/vis.circsPerRow) * (vis.padfact+1) * vis.r+vis.r/3) ;
            })
            .attr('height', 1.3*vis.r)
            .attr('width', 1.3*vis.r)
            .attr('class','icon')
    }

}