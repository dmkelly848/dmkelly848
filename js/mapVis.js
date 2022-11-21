// adapted from lab 9 globe visualization code

class MapVis {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.geoData = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Host Cities')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // create projection
        vis.projection = d3.geoOrthographic()
            // vis.projection = d3.geoStereographic() was interesting - but probably less intuitive than geoOrthographic
            // guess-and-check to scale size
            .scale(vis.height * .42)
            .translate([vis.width / 2, vis.height / 2])

        // pass projection to geogenerator
        vis.path = d3.geoPath()
            .projection(vis.projection);

        // code for building sphere
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        // convert topoJSON to GeoJSON
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        // draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)

        // append tooltip (Same as pie chart)
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')

        // creating legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 2.7 / 4}, ${vis.height - 40})`)

        // step 10, free code: making map draggable
        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )

        // adapting hw 8 code to make axis for legend
        vis.x = d3.scaleLinear()
            .domain([0,100])
            .range([0,160]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickValues([0,25,50,75,100])

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', `translate(${vis.width * 2.7 / 4}, ${vis.height - 20})`)

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {
            let randomCountryValue = Math.random() * 4
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue),
                color: vis.colors[Math.floor(randomCountryValue)],
                value: randomCountryValue / 4 * 100
            }
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // based off example from pie chart earlier, using countryInfo data above
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })
            // creating event listener to create tooltip, same as piechart activity
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'rgba(173,222,255,0.62)')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    // going off example from screenshot
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h3>${d.properties.name}<h3> 
                        <h4> name: ${d.properties.name}</h4>      
                        <h4> category: ${vis.countryInfo[d.properties.name].category}</h4>
                        <h4> color: ${vis.countryInfo[d.properties.name].color}</h4>   
                        <h4> value: ${vis.countryInfo[d.properties.name].value}</h4>                      
                        </div>`);
            })
            // mouseout code following lab page instructions
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .style("fill", vis.countryInfo[d.properties.name].color)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        // provided code to make/format legend
        vis.legend.selectAll(".legend-rect").data(vis.colors)
            .enter()
            .append("rect")
            .style("fill", (d,index)=>vis.colors[index])
            .attr("class", "legend-rect")
            .attr("x", (d,index)=>index*40)
            .attr("y", 0)
            .attr("height", 20)
            .attr("width", 40)

        // code from HW8 to call x axis
        vis.svg.select(".x-axis").call(vis.xAxis);
    }
}