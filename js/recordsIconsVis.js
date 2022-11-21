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

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.gender = d3.select("#records-gender").property("value")

        console.log(vis.gender)

        // if not by index, sort greatest to least
        if (vis.gender === 'M') {
            vis.displayData = vis.mensRecords
            vis.displayData.forEach((row,index) => {
                vis.displayData[index]['Records'] = mensRecordMatrix[index]
            })
            vis.displayData['years'] = ['1896', '1900', '1904', '1908', '1912', '1920', '1924', '1928', '1932', '1936','1948', '1952', '1956', '1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988', '1992', '1996', '2000', '2004', '2008', '2012', '2016']
        } else if (vis.gender === 'W') {
            vis.displayData = vis.womensRecords
            vis.displayData.forEach((row,index) => {
                vis.displayData[index]['Records'] = womensRecordMatrix[index]
                vis.displayData['years'] = ['1928', '1932', '1936', '1948', '1952', '1956', '1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988', '1992', '1996', '2000', '2004', '2008', '2012', '2016']

            })
        }


        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(vis.displayData)

        // labels acting up - will revisit TODO
        // vis.labels = vis.svg.selectAll(".record-year-label")
        //     .data(vis.displayData.years)
        //
        // vis.labels.exit().remove()
        //
        // vis.labelsGroup = vis.labels.enter()
        //     .append("g")
        //     .merge(vis.labels)
        //     .attr('transform', function(d,index) {return `translate(${ index * (15 + vis.cellPadding)}, 0)`})
        //
        // //vis.labelsGroup.selectAll('.record-year-label').exit().remove()
        //
        // vis.labelsGroup.append("text")
        //     .attr("class", "record-year-label")
        //     .attr('transform', 'rotate(-90)')
        //     .attr('x', -30)
        //     .attr('y', 135)
        //     .attr('text-anchor', 'beginning')
        //     .style('fill','black')
        //     .text(d=>d)

        vis.rows = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData, function (d) {
                return d.Event;
            })

        vis.rows.exit().remove()

        vis.rowGroups = vis.rows.enter()
            .append("g")
            .merge(vis.rows)
            .attr("class", "matrix-row")
            .attr('transform', function (d, index) {
                return `translate(0, ${index * (15 + vis.cellPadding)})`
            })

        vis.rowGroups.selectAll(".record-label").exit().remove()

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
                return `translate(0, ${ 40 + index * (15 + vis.cellPadding)})`
            })

        vis.recordSquare = vis.rowGroups.selectAll(".record-square")
            .data(d=>d.Records);

        vis.recordSquare.exit().remove()

        vis.recordSquare.enter().append("rect")
            .merge(vis.recordSquare)
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
                    return "green"
                } else {
                    return "grey"
                }
            })

    }
}