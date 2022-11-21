class RecordsIconsVis {

    constructor(parentElement, data, mensRecords, womensRecords) {
        this.parentElement = parentElement;
        this.data = data;
        this.mensRecords = mensRecords;
        this.womensRecords = womensRecords;

        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        //vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.circsPerRow = 6;
        vis.color = '#3e76ec';
        vis.opacity = .35;
        vis.padfact = 2.2;
        vis.fontsize = 'small';
        vis.rfact = 1.3;
        vis.r = 40

        // starting value
        vis.gender = d3.select("#records-gender").property("value")
        if (vis.gender === 'M') {
            vis.chosenYear = vis.parseDate(1896)
        } else {
            vis.chosenYear = vis.parseDate(1928)
        }

        vis.wrangleData()
        vis.createSlider()
    }

    wrangleData() {
        let vis = this;

        console.log(vis.gender)

        if (vis.gender === 'M') {
            vis.displayData = vis.mensRecords
            vis.displayData.forEach((row, index) => {
                vis.displayData[index]['Records'] = mensRecordMatrix[index]
            })
            vis.displayData['years'] = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016]
        } else if (vis.gender === 'W') {
            vis.displayData = vis.womensRecords
            vis.displayData.forEach((row, index) => {
                vis.displayData[index]['Records'] = womensRecordMatrix[index]
                vis.displayData['years'] = [1928, 1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016]

            })
        }

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(vis.chosenYear)

        vis.circleData = vis.displayData.filter(function (d) {
            return (d[vis.formatDate(vis.chosenYear)] === '1')
        });

        console.log(vis.circleData)

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
            .attr("fill", vis.color);

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

    createSlider() {
        let vis = this;

        vis.slidData = vis.displayData;

        vis.slider = document.getElementById("slider-round-record");
        noUiSlider.create(vis.slider, {
            start: [d3.min(vis.slidData.years)],
            step: 4,
            margin: 4,
            range: {
                'min': d3.min(vis.slidData.years),
                'max': d3.max(vis.slidData.years)
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
            vis.chosenYear = vis.parseDate(values[0]);
            console.log(vis.chosenYear)
            vis.wrangleData();
        });
    }

    updateSlider() {
        let vis = this;
        vis.gender = d3.select("#records-gender").property("value")

        console.log('here')
        vis.slider.noUiSlider.destroy()
        vis.createSlider();
    }

}