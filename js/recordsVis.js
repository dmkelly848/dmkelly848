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
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.cellPadding = 5
        vis.cellHeight = 25
        vis.cellWidth = 25

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.gender = d3.select("#records-gender").property("value")

        console.log(vis.gender)

        // if not by index, sort greatest to least
        if (vis.gender === 'M') {
            vis.displayData = vis.mensRecords
        }
        else if (vis.gender === 'W'){
            vis.displayData = vis.womensRecords
        }

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(vis.displayData)

    }
}