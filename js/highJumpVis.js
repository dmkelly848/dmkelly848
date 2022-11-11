/* * * * * * * * * * * * * *
*          HighJumpVis          *
* * * * * * * * * * * * * */


class HighJumpVis {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = 400;//document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 400;//document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.cellHeight = 20;
        vis.cellWidth = 20;
        vis.cellPadding = 20;

        vis.chosenYear = 1896;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add main bar
        vis.crossBar = vis.svg.append('rect')
            .attr('height', 3)
            .attr('width', vis.width)
            .attr('x', 0)
            .style('fill','red');

        // add "posts" on each side
        vis.leftRect = vis.svg.append('rect')
            .attr('height', vis.height)
            .attr('width', 5)
            .attr('x', 0)
            .attr('y', 0)
        vis.rightRect = vis.svg.append('rect')
            .attr('height', vis.height)
            .attr('width', 5)
            .attr('x', vis.width-5)
            .attr('y', 0)

        // add scale + axis
        vis.y = d3.scaleLinear()
            .range([vis.height,0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);
        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData()
        vis.createSlider()
    }



    wrangleData() {
        let vis = this;

        vis.jumpData = [];

        // get only high jump results
        vis.resultsData.forEach((element) => {
            if(element.Event === 'High Jump'){
                vis.jumpData.push(element);
            }})

        // filter and sort data
        vis.jumpData = vis.jumpData.filter(function (d){
            return (d.Medal === 'G') && (d.Gender === 'M')
        });
        vis.jumpData.sort((a,b) => {return a.Year - b.Year})

        // get datum from selected year
        vis.displayData = vis.jumpData.filter(function (d){
            return (+vis.formatDate(d.Year) === vis.chosenYear)
        });

        console.log(vis.displayData);
        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // Update y scale domain
        vis.y.domain([0, d3.max(vis.jumpData, d => d.Clean_Result)]);
        vis.svg.select(".y-axis").call(vis.yAxis);

        // update position of bar
        vis.crossBar
            .transition()
            .duration(100)
            .attr("y", vis.y(vis.displayData[0].Clean_Result));

    }


    // Create slider
    createSlider(){
        let vis = this;
        //slider code
        vis.slider = document.getElementById("time-period-slider");
        noUiSlider.create(vis.slider, {
            start: [d3.min(vis.jumpData, (d) => +vis.formatDate(d.Year))],// d3.max(vis.jumpData, (d) => +vis.formatDate(d.Year))],
            step: 4,
            margin: 4,
            range: {
                'min': d3.min(vis.jumpData, (d) => +vis.formatDate(d.Year)),
                'max': d3.max(vis.jumpData, (d) => +vis.formatDate(d.Year))
            },
            tooltips: [true],
            format: {
                from: d => d,
                to: d => d
            }
        });

        // create listener for sliders
        vis.slider.noUiSlider.on('slide', function (values) {
            vis.chosenYear = values[0];
            vis.wrangleData();
        });
    }
}