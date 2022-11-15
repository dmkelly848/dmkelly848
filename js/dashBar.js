/* * * * * * * * * * * * * *
*      Dash Bar          *
* * * * * * * * * * * * * */

class DashBar {

    constructor(parentElement, resultsData, continentData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;

        this.initVis()
    }

    initVis() {
        let vis = this;
        console.log('dashbar')

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        // initialize counts
        vis.goldCount = 0;
        vis.silverCount = 0;
        vis.bronzeCount = 0;

        // if we have name mapping for country use that as display
        vis.dispCountry = ''
        let selection = vis.continentData.find(d => d.Code === selCountry)
        if(!(selection===undefined))
            vis.dispCountry = selection.Country;
        else
            vis.dispCountry = selCountry;
        console.log(vis.dispCountry)

        // count by medal type and filter on country
        vis.resultsData.forEach(row => {
                if (row.Nationality === selCountry || selCountry === 'Worldwide') {
                    if (row.Medal === 'G')
                        vis.goldCount += 1;
                    else if (row.Medal === 'S')
                        vis.silverCount += 1;
                    else
                        vis.bronzeCount += 1
                }
            }
        )
        vis.updateVis()
    }



    updateVis() {
        let vis = this;


    }
}