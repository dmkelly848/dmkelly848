/* * * * * * * * * * * * * *
*      CIRCLES Vis          *
* * * * * * * * * * * * * */

class BandVis {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width / 2, 'y': vis.height / 2};

        //define type-dependent variables
        vis.circs = 10;
        vis.padfact = 2.2;
        vis.opacity = 0.35;
        vis.rfact = 1.3;
        // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
        vis.tempData = [...new Set(vis.resultsData.map(d => d.Event))];
        vis.circleData = []
        vis.tempData.forEach((event,idx) => {
            let temp = {}
            temp['event'] = event;
            if(idx % 5 === 0)
                temp['color'] = '#3e76ec';
            else if(idx % 5 === 1)
                temp['color'] = '#ffce01';
            else if(idx % 5 === 2)
                temp['color'] = '#000000';
            else if(idx % 5 === 3)
                temp['color'] = '#179a13';
            else
                temp['color'] = '#ff0000';
            vis.circleData.push(temp);
        })
        console.log(vis.circleData)

        vis.r = vis.width / (vis.circs * 4);


        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.clip = vis.svg.append("clipPath")
            .attr("id", "band-clip")
            .append("rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', vis.width)
            .attr('height', vis.height)


        vis.wrangleData();
    }



    wrangleData() {
        let vis = this;
        vis.circleData.unshift(vis.circleData.pop())
        vis.displayData = vis.circleData.slice(0,vis.circs+3)
        //https://stackoverflow.com/questions/16097271/shift-array-to-right-in-javascript
        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        vis.circles = vis.svg.selectAll(`.circle-band`).data(vis.displayData, d=>d.event)
        vis.circles.exit().remove()
        vis.circles.enter().append("circle")
            .attr('class', `circle-band`)
            .attr("clip-path", "url(#band-clip)")
            .attr("cx", function (d, i) {
                return vis.width/vis.circs * (i-1)
            })
            .merge(vis.circles)
            .attr("cy", vis.height - 2*vis.r)
            .style('opacity', vis.opacity)
            .attr("fill", d=>d.color)
            .attr("r", vis.r * vis.rfact)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("cx", function (d, i) {
                return vis.width/vis.circs * (i-1)
            });

        vis.icons = vis.svg.selectAll(".icon").data(vis.displayData, d=>d.event)
        vis.icons.exit().remove()
        vis.icons.enter().append("svg:image")
            .attr("class", "icon")
            .attr("clip-path", "url(#band-clip)")
            .attr("x", function (d, i) {
                return vis.width/vis.circs * (i-1)- 3*vis.r/4;
            })
            .merge(vis.icons)
            .attr("xlink:href", d => `img/icons/${d.event}.png`)
            .attr("y", vis.height - 2*vis.r - 2*vis.r/3)
            .attr('height', 1.5 * vis.r)
            .attr('width', 1.5 * vis.r)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("x", function (d, i) {
                return vis.width/vis.circs * (i-1)- 3*vis.r/4;
            });
    }


}