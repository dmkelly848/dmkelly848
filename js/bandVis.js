/* * * * * * * * * * * * * *
*      Band Vis          *
* * * * * * * * * * * * * */

//This is the carousel of icons that decorates the weeebsitee's title page
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
        vis.padfact = 1;
        vis.opacity = 1;
        vis.rfact = 1.3;
        // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
        vis.tempData = [...new Set(vis.resultsData.map(d => d.Event))];
        vis.circleData = []
        vis.tempData.forEach((event,idx) => {
            let temp = {}
            temp['event'] = event;
            if(idx % 5 === 0)
                temp['color'] = '#BCCDF3';
            else if(idx % 5 === 1)
                temp['color'] = '#fce6ab';
            else if(idx % 5 === 2)
                temp['color'] = '#c0c0c0';
            else if(idx % 5 === 3)
                temp['color'] = '#b7d9b5';
            else
                temp['color'] = '#f6a6a6';
            vis.circleData.push(temp);
        })

        vis.r = vis.width / (vis.circs * 4.5);


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

        //Circlse behind icons
        vis.circles = vis.svg.selectAll(`.circle-band`).data(vis.displayData, d=>d.event)
        vis.circles.exit().remove()
        vis.circles.enter().append("circle")
            .attr('class', `circle-band`)
            .attr("clip-path", "url(#band-clip)")
            .attr("cx", function (d, i) {
                return vis.width/vis.circs * (i-1)
            })
            .merge(vis.circles)
            .attr("cy", vis.height - 1.5*vis.r)
            .style('opacity', vis.opacity)
            .attr("fill", d=>d.color)
            .attr("r", vis.r * vis.rfact)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("cx", function (d, i) {
                return vis.width/vis.circs * (i-1)
            });

        //Icons themselves
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
            .attr("y", vis.height - 1.5*vis.r - 2*vis.r/3)
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