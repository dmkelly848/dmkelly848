/* * * * * * * * * * * * * *
*      Tree Vis          *
* * * * * * * * * * * * * */
// based on https://d3-graph-gallery.com/graph/treemap_basic.html

class TreeVis {

    constructor(parentElement, resultsData, continentData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.continentData = continentData;
        this.formatDate = d3.timeFormat("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        // Define colors
        vis.colors = {
            'Africa': '#ffce01',
            'North America': '#ff0000',
            'Europe': '#3e76ec',
            'Asia': '#179a13',
            'Oceania': '#702963',
            'South America': '#FF5F15',
            'N/A': '#888888',
        }

        // vis.x = d3.scaleLinear()
        //     .range([0, vis.width])
        //
        // // using ordinal scale for bar charts, similar to hw 5, with source: https://github.com/d3/d3-scale/blob/main/README.md
        // vis.y = d3.scaleBand()
        //     .range([0, vis.height])
        //     // source: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js for padding
        //     .padding(.1)
        //
        // // creating axes with the scales and appending groups
        // vis.xAxis = d3.axisBottom()
        //     .scale(vis.x);
        // vis.yAxis = d3.axisLeft()
        //     .scale(vis.y);
        //
        // vis.svg.append("g")
        //     .attr("class", "x-axis axis")
        //     .attr("transform", "translate(0," + vis.height + ")");
        //
        // vis.svg.append("g")
        //     .attr("class", "y-axis axis");

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

        // credit to https://d3-graph-gallery.com/graph/treemap_basic.html
        vis.root = d3.stratify()
            .id(d=>d.country)
            .parentId(d=>d.continent)
            (vis.displayData)
            .sum(d => d.medal_count);

        d3.treemap()
            .size([vis.width, vis.height])
            .padding(3)
            (vis.root)
        console.log(vis.root.leaves())

        vis.rects = vis.svg.selectAll("rect")
            .data(vis.root.leaves());
        vis.rects.enter()
            .append("rect")
            .attr('class', 'tree-rect')
            .merge(vis.rects)
            .attr('width', d=>d.x1-d.x0)
            .attr('height', d=>d.y1-d.y0)
            .attr('x', d=>d.x0)
            .attr('y', d=>d.y0)
            .attr("stroke", "black")
            .attr("fill", d=>vis.colors[d.data.continent])
            //.attr("opacity", d=>Math.sqrt(d.data.medal_count)/6);
        vis.rects.exit();

        vis.labels = vis.svg.selectAll("text")
            .data(vis.root.leaves());
        vis.labels.enter()
            .append("text")
            .attr('class', 'label tree-rect-label')
            .merge(vis.labels)
            .attr("x", d=>d.x0+10)
            .attr("y", d=>d.y0+20)
            .text(function(d){
                if(d.data.medal_count > 15)
                    return d.data.country;
            })
    }
}