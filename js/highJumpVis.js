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

        vis.margin = {top: 20, right: 20, bottom: 0, left: 20};
        vis.yAxisPad = 30;
        vis.xAxisPad = 30;
        vis.unchanged = true;
        if(document.getElementById('high-jump-gender').value === 'M'){
            vis.chosenYear = 1896
        }
        else{
            vis.chosenYear = 1932
        }

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        // init drawing area
        vis.draw = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
        vis.svg = vis.draw.append('g')
            .attr('transform', `translate (${vis.yAxisPad},0)`);

        vis.width = vis.width - vis.yAxisPad;

        // add main bar
        vis.crossBarGroup = vis.svg.append('g')
        vis.crossBar = vis.crossBarGroup.append('rect')
            .attr('height', 5)
            .attr('width', vis.width)
            .attr('x', 0)
            .style('fill','#F44200')
            .style('stroke', '#555555');
        // add tooltip
        vis.labelGroup = vis.crossBarGroup.append('g')
            .attr('class', 'jump-tooltip')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, ${-1*vis.height/20})`)
            .style("font-size", 'smaller')
            .attr('text-anchor', 'middle');

        // add mat
        vis.matFront = vis.svg.append('rect')
            .attr('height', vis.height/3)
            .attr('width', vis.width)
            .attr('x', 0)
            .attr('y', vis.height*2/3)
            .style('fill', '#666666')//'#476442')
        vis.matTop = vis.svg.append('rect')
            .attr('height', vis.height/15)
            .attr('width', vis.width)
            .attr('x', 0)
            .attr('y', vis.height*2/3)
            .style('fill', '#999999')//69a669')
            .style('stroke', 'black')
        vis.img = vis.svg.append('svg:image')
            .attr("xlink:href", function() {return "img/rings_white.png"})
            .attr('x', vis.width/2-vis.width/10)
            .attr('y', vis.height*7/9)
            .attr('width', vis.width/5)


        // add "posts" on each side
        vis.leftRect = vis.svg.append('rect')
            .attr('height', vis.height)
            .attr('width', 7)
            .attr('x', 0)
            .attr('y', 0)
            .style('fill', '#555555')
        vis.rightRect = vis.svg.append('rect')
            .attr('height', vis.height)
            .attr('width', 7)
            .attr('x', vis.width-7)
            .attr('y', 0)
            .style('fill', '#555555')
        vis.triangleGroup = vis.svg.append('g')
            .attr("class", "triangle-group")
        vis.leftTriangle = vis.crossBarGroup.append('path')
            .attr("class", "left-triangle")
            .attr("d", 'M 0 -15 l 0 20 l 20 0 z')
            .style('fill', '#555555')
        vis.rightTriangle = vis.crossBarGroup.append('path')
            .attr("class", "right-triangle")
            .attr("d", `M ${vis.width} -15 l 0 20 l -20 0 z`)
            .style('fill', '#555555')

        // add scale + axis
        vis.y = d3.scaleLinear()
            .range([vis.height,0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", `translate(0, 0)`);


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
            return (d.Medal === 'G') && (d.Gender === document.getElementById('high-jump-gender').value)
        });
        vis.jumpData.sort((a,b) => {return a.Year - b.Year})

        // get datum from selected year
        vis.displayData = vis.jumpData.filter(function (d){
            return (+vis.formatDate(d.Year) === vis.chosenYear)
        });

        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        // Update y scale domain
        vis.y.domain([0, d3.max(vis.jumpData, d => d.Clean_Result)+0.5]);
        vis.svg.select(".y-axis").call(vis.yAxis);

        // update text
        vis.labelGroup.text(vis.displayData[0].Name + ": "+ " " + vis.displayData[0].Clean_Result+"m")

        // update position of bar
        vis.crossBarGroup
            .transition()
            .duration(500)
            .attr("transform", `translate(0, ${vis.y(vis.displayData[0].Clean_Result)})`);
    }


    // Create slider
    createSlider(){
        let vis = this;
        //slider code
        vis.slider = document.getElementById("slider-round");
        noUiSlider.create(vis.slider, {
            start: [d3.min(vis.jumpData, (d) => +vis.formatDate(d.Year))],
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
            },
            pips: {
                mode: 'count',
                values: 6,
                density: 6
            }
        });

        // create listener for sliders
        vis.slider.noUiSlider.on('slide', function (values) {
            vis.chosenYear = values[0];
            vis.wrangleData();
        });
    }

    updateSlider(){
        console.log('slide')
        vis.slider.noUiSlider.updateOptions({
            range: {
                'min': d3.min(vis.jumpData, (d) => +vis.formatDate(d.Year)),
                'max': d3.max(vis.jumpData, (d) => +vis.formatDate(d.Year))
            }
        });
    }
}

