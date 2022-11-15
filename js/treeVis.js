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
        vis.margin = {top: 20, right:20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        // Define colors
        vis.colors = {
            'Africa': '#FF5F15',
            'North America': '#ff0000',
            'Europe': '#3e76ec',
            'Asia': '#179a13',
            'Oceania': '#702963',
            'South America': '#ffce01',
            'N/A': '#888888',
        }

        // add tooltip
        vis.tooltipGroup = vis.svg.append('g')
            .attr('id', 'treemapTooltip')
        vis.tooltip = vis.tooltipGroup.append('div')


        // vis.legendGroup = vis.svg.append('g')
        //     .attr('class',"legendgroup")
        // vis.legendGroup.selectAll('.rect-leg')
        //     .data(Object.keys(vis.colors))
        //     .enter().append('rect')
        //     .attr('class', 'rect-leg')
        //     .attr('width', 20)
        //     .attr('height', 20)
        //     .attr('x', 500)
        //     .attr('y', function(d,index){return 50+index*30})
        //     .attr("fill", "blue")


        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        //console.log(vis.resultsData)

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


        //console.log(vis.displayData)
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
        //console.log(vis.root.leaves())

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
            .on('click', function(event, d) {
                vis.svg.selectAll('rect')
                    .style('opacity', '0.4')
                d3.select(this) // change color or selected country
                    .style('stroke-width', '2px')
                    .style('fill', d=>vis.colors[d.data.continent])
                    .style('opacity', 1)
                selCountry = d.data.country
                dashInfo.wrangleData()
                dashBar1.wrangleData()
            })
            // .on('mouseover', function(event, d) {
            //     vis.svg.selectAll('rect')
            //         .style('opacity', '0.4')
            //     d3.select(this) // change color or selected country
            //         .style('stroke-width', '2px')
            //         .style('fill', d=>vis.colors[d.data.continent])
            //         .style('opacity', 1)
            //     // vis.tooltipGroup
            //     //     .attr("transform", `translate(${d.x0+20},${d.y0-20})`)
            //     // vis.tooltip
            //     //     .attr('font-size', 'medium')
            //     //     .style("left", event.pageX + 20 + "px")
            //     //     .style("top", event.pageY + "px")
            //     //     .style('fill', 'black')
            //     //     .html(`
            //     //      <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
            //     //          <h3>${d.data.country}</h3>
            //     //          <h4> Medals: ${d.data.medal_count}</h4>
            //     //      </div>`);
            // })
            .on('mouseout', function(event, d) {
                vis.svg.selectAll('rect')
                    .style('stroke-width', '1px')
                    .style('opacity', 1)
                // vis.tooltip
                //     .style("opacity", 0)
                //     .style("left", 0)
                //     .style("top", 0)
                //     .html(``);
            })
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
                if(d.data.medal_count > 14)
                    return d.data.country;
            })
            .attr('font-size', function(d){return (Math.sqrt(d.data.medal_count)+35)+'%'})
    }
}