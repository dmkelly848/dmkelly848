// based off matrix.js from lab 10

class RecordsVis {

    constructor(parentElement, data, mensRecords, womensRecords) {
        this.parentElement = parentElement;
        this.data = data;
        this.mensRecords = mensRecords;
        this.womensRecords = womensRecords;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        //vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.cellPadding = 5
        vis.cellHeight = 15
        vis.cellWidth = 15

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.gender = d3.select("#records-gender").property("value")

        console.log(vis.gender)

        // if not by index, sort greatest to least
        if (vis.gender === 'M') {
            vis.displayData = vis.mensRecords
        } else if (vis.gender === 'W') {
            vis.displayData = vis.womensRecords
        }

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(vis.displayData)

        vis.rows = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData, function (d) {
                return d.Event;
            })

        vis.rowGroups = vis.rows.enter()
            .append("g")
            .merge(vis.rows)
            .attr("class", "matrix-row")
            .attr('transform', function (d, index) {
                return `translate(0, ${index * (15 + vis.cellPadding)})`
            })

        vis.rowGroups.append("text")
            .attr('x', 10)
            .attr('y', 15)
            .attr('class', 'record-label')
            .style('fill', 'black')
            .text(d => d.Event)

        vis.rowGroups.data(vis.displayData, function (d) {
            return d.Event;
        })
            .merge(vis.rows)
            .attr('transform', function (d, index) {
                return `translate(0, ${index * (15 + vis.cellPadding)})`
            })

        vis.recordSquare = vis.rowGroups.selectAll(".record-square")
            .data(vis.displayData);

        vis.recordSquare.enter().append("rect")
            .attr("class", "record-square")
            .attr('transform', 'translate(125,0)')
            .attr("x", function (d, index) {
                return (vis.cellWidth + vis.cellPadding) * index
            })
            .attr("y", 0)
            .attr('width',vis.cellWidth)
            .attr('height',vis.cellHeight)
            .style("fill", function (d, index) {
            if (d === 1) {
                return "red"
            } else {
                return "grey"
            }
        })

    }
}