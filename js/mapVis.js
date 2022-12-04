// adapted from lab 9 globe visualization code

class MapVis {

    constructor(parentElement, data, geoData, hostData) {
        this.parentElement = parentElement;
        this.data = data;
        this.geoData = geoData
        this.hostData = hostData

        // this.colors = ['#000000', '#aaffaa']
        this.colors = ['#000000', '#ff0000']

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 20, bottom: 10, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

        console.log(vis.width)

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.width)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.projection = d3.geoOrthographic()
            .scale(vis.width * .40)
            .translate([vis.width / 2, vis.width / 2])

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')


        //free code: making map draggable
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

                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // create data structure with information for each land

        console.log(vis.geoData.objects.countries.geometries)

        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {

            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
            }

            vis.countryInfo[d.properties.name]['color'] = vis.colors[0]
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })
            // // source: https://bl.ocks.org/austinczarnecki/fe80afa64724c9630930
            // // source: https://github.com/d3/d3-geo
            // .on('click', function(event, d){
            //
            //     d3.select(this).transition()
            //         .duration(1250)
            //         .tween("rotate", function() {
            //             // find source array.find
            //             var p = d3.geoCentroid(vis.world.find((e) => e.id === d.id)),
            //                 r = d3.geoInterpolate(vis.projection.rotate(), [-p[0], -p[1]]);
            //             return function (t) {
            //                 vis.projection.rotate(r(t));
            //                 vis.svg.selectAll("path").attr("d", vis.path);
            //             }
            //         });
            // })
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'red')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div class = "olympicBodyText" style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h3>${d.properties.name}<h3>                       
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

        d3.select(vis).transition()
            .duration(50)
            .tween("rotate", function() {
                // find source array.find
                var p = d3.geoCentroid(vis.world.find((e) => e.properties.name === 'Greece')),
                    r = d3.geoInterpolate(vis.projection.rotate(), [-p[0], -p[1]]);
                return function (t) {
                    vis.projection.rotate(r(t));
                    vis.svg.selectAll("path").attr("d", vis.path);
                }
            });

        document.getElementById('previousGames').style.visibility = 'hidden'
        vis.countryInfo['Greece']['color'] = vis.colors[1]
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })



    }

    spinVis() {
        let vis = this;

        vis.hostData.forEach(d => {
            vis.countryInfo[d.Host]['color'] = vis.colors[0]
        })


        // source: https://bl.ocks.org/austinczarnecki/fe80afa64724c9630930
        // source: https://github.com/d3/d3-geo
            d3.select(vis).transition()
                .duration(1250)
                .tween("rotate", function() {
                    // find source array.find
                    var p = d3.geoCentroid(vis.world.find((e) => e.properties.name === vis.hostData[mapYearIndex].Host)),
                        r = d3.geoInterpolate(vis.projection.rotate(), [-p[0], -p[1]]);
                    return function (t) {
                        vis.projection.rotate(r(t));
                        vis.svg.selectAll("path").attr("d", vis.path);
                    }
                });

        vis.countryInfo[vis.hostData[mapYearIndex].Host]['color'] = vis.colors[1]
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })
    }
}