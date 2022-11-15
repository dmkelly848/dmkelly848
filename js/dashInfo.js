/* * * * * * * * * * * * * *
*      Dash Info          *
* * * * * * * * * * * * * */

class DashInfo {

    constructor(parentElement, resultsData, continentData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;

        this.initVis()
    }

    initVis() {
        let vis = this;

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

        vis.svg.append('circle')
            .attr('cx', vis.width/2)
            .attr("cy", vis.height/2)
            .attr('r', vis.height/6)
            .attr('fill', 'gold')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
        vis.svg.append('circle')
            .attr('cx', vis.width/4)
            .attr("cy", vis.height/2)
            .attr('r', vis.height/6)
            .attr('fill', 'silver')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
        vis.svg.append('circle')
            .attr('cx', 3*vis.width/4)
            .attr("cy", vis.height/2)
            .attr('r', vis.height/6)
            .attr('fill', 'bronze')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)

        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        console.log(vis.resultsData)

        // initialize necessary structure for treemap and d3.stratify()
        vis.displayData = [
            {country: 'Origin', continent: '', medal_count: ''},
            {country: 'Europe', continent: 'Origin', medal_count: ''},
            {country: 'North America', continent: 'Origin', medal_count: ''},
            {country: 'N/A', continent: 'Origin', medal_count: ''},
            {country: 'Africa', continent: 'Origin', medal_count: ''},
            {country: 'Oceania', continent: 'Origin', medal_count: ''},
            {country: 'Asia', continent: 'Origin', medal_count: ''},
            {country: 'South America', continent: 'Origin', medal_count: ''},
        ]

        // loop through results and count by country, also map to continent
        vis.resultsData.forEach(row => {
                let nat = row.Nationality;
                let countryObj = {};
                let existing = vis.displayData.map(d => d.country);

                if (!(existing.includes(nat))) {
                    countryObj['country'] = nat;
                    let sel = vis.continentData.find(d => d.Code === nat)
                    let cont = ''
                    if(sel===undefined)
                        cont = 'N/A';
                    else
                        cont = sel.Continent;
                    countryObj['continent'] = cont
                    countryObj['medal_count'] = 1;
                    vis.displayData.push(countryObj)
                } else {
                    vis.displayData.find(d => d.country === nat).medal_count += 1;
                }
            }
        )


        console.log(vis.displayData)
        vis.updateVis()
    }



    updateVis() {
        let vis = this;


    }
}