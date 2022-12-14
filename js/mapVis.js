// adapted from lab 9 globe visualization code

class MapVis {

    constructor(parentElement, data, geoData, hostData) {
        this.parentElement = parentElement;
        this.data = data;
        this.geoData = geoData
        this.hostData = hostData

        this.colors = ['#888888', '#179a13']

        this.initVis()
    }

    initVis() {
        let vis = this;

        // creating margin convention
        vis.margin = {top: 10, right: 20, bottom: 10, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.width*.95)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // creating projection, path, background, lat/long lines
        vis.projection = d3.geoOrthographic()
            .scale(vis.width * .40)
            .translate([vis.width *.45, vis.width *.45])

        vis.path = d3.geoPath()
            .projection(vis.projection);

        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#FFFFFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        // source: https://map-projections.net/d3-customizable-wagner/static.php?v=7&x=3
        vis.graticule = d3.geoGraticule();
        vis.svg.append("path")
            .datum(vis.graticule)
            .attr("class", "graticule")
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("fill", "rgba(0,0,0,0)")
            .attr("d", vis.path);

        // getting features
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        // appending paths
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)


        //provided code to make it draggable
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

        // style countries with base color
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })

        // creating starting position for globe
        d3.select(vis).transition()
            .duration(50)
            .tween("rotate", function() {
                // source: https://www.w3schools.com/jsref/jsref_find.asp
                var p = d3.geoCentroid(vis.world.find((e) => e.properties.name === 'Greece')),
                    r = d3.geoInterpolate(vis.projection.rotate(), [-p[0], -p[1]]);
                return function (t) {
                    vis.projection.rotate(r(t));
                    vis.svg.selectAll("path").attr("d", vis.path);
                }
            });

        // edge case for previous/next buttons, set Greece color
        document.getElementById('previousGames').style.visibility = 'hidden'
        vis.countryInfo['Greece']['color'] = vis.colors[1]
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })

    }

    spinVis() {
        let vis = this;

        // set colors back to base
        vis.hostData.forEach(d => {
            vis.countryInfo[d.Host]['color'] = vis.colors[0]
        })

        // source: https://bl.ocks.org/austinczarnecki/fe80afa64724c9630930
        // source: https://github.com/d3/d3-geo
        // spin world using selected year
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

        // color host country with right color
        vis.countryInfo[vis.hostData[mapYearIndex].Host]['color'] = vis.colors[1]
        vis.countries.style("fill", function(d) { return vis.countryInfo[d.properties.name].color; })
    }
}