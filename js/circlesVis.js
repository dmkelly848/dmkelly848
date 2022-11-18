/* * * * * * * * * * * * * *
*      CIRCLES Vis          *
* * * * * * * * * * * * * */

class CircleVis {

    constructor(parentElement, resultsData, circleData, type) {
        this.parentElement = parentElement;
        this.circleData = circleData;
        this.resultsData = resultsData;
        this.type = type;
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 30, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        //define type-dependent variables
        let circsPerRow;
        let color, fontsize, padfact, rfact, opacity;
        if(vis.type===1) {
            circsPerRow = 6;
            padfact = 2.2;
            color = '#3e76ec'
            opacity = 0.35;
            fontsize = 'small';
            rfact = 1.3;
            // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
            vis.circleData = [...new Set(vis.resultsData.map(d => d.Event))];
            console.log(vis.circleData)
        }
        else{
            circsPerRow = 3;
            padfact = 2;
            rfact = 1;
            opacity = 0.35;
            fontsize = 'normal'
            color = '#ff0000'
        }
        let r = vis.width/(circsPerRow*4)


        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.circles = vis.svg.selectAll(`circle${vis.type}`).data(vis.circleData)
        vis.circles.enter().append("circle")
            .attr('class', `circle${vis.type}`)
            .attr('id', d=>`circ-${d.split(' ').join('')}`)
            .attr("cx",function(d,i){
                return (i%circsPerRow * vis.width/circsPerRow) + padfact*r;
            })
            .attr("cy",function (d,i){
                return (Math.floor(i/circsPerRow) * (padfact+1) * r) + r;
            })
            .attr("r",r*rfact)
            .style('opacity', opacity)
            .attr("fill",color);


        if(vis.type === 2){
            vis.labels = vis.svg.selectAll(".labs").data(vis.circleData)
            vis.labels.enter().append("text")
                .attr("class","olympicHeadText")
                .attr("x",function (d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r;
                })
                .attr("y", function(d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r) + 2.5*r;
                })
                .attr("text-anchor","middle")
                .attr('font-size', 40)
                .text(d=> d);

            vis.icons = vis.svg.selectAll(".icon").data(vis.circleData)
            vis.icons.enter().append("svg:image")
                .attr("class","icon")
                .attr("xlink:href", d=>`img/icons/${d}.png`)
                .attr("x",function (d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r - r*2/3;
                })
                .attr("y", function(d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r+r/3) ;
                })
                .attr('height', 1.3*r)
                .attr('width', 1.3*r);


        }
        else{
            vis.icons = vis.svg.selectAll(".icon").data(vis.circleData)
            vis.icons.enter().append("svg:image")
                .attr("class","icon")
                .attr("xlink:href", d=>`img/icons/${d}.png`)
                .attr("x",function (d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r-20;
                })
                .attr("y", function(d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r) + r-20;
                })
                .attr('height', 1.5*r)
                .attr('width', 1.5*r);

            vis.divider = vis.svg.append('line')
                .style("stroke", "white")
                .style("stroke-width", 2)
                .attr("x1", 0)
                .attr("y1", vis.height*0.7)
                .attr("x2", vis.width)
                .attr("y2", vis.height*0.7);

            vis.bigCircle = vis.svg.append('circle')
                .style("fill", "#3e76ec")
                .style('opacity', 0)
                .attr("r", r*2.5)
                .attr("cy", vis.height*0.7+3.5*r)
                .attr("cx", 3*r)

            vis.bigPicture = vis.svg.append('svg:image')
                .attr("class","icon")
                .attr("y", vis.height*0.7+3.5*r-1.6875*r)
                .attr('x', 3*r-1.6875*r)
                .attr('height', 3.375*r)
                .attr('width', 3.375*r);

            vis.eventTitlePopup = vis.svg.append('text')
                .attr("class","olympicHeadText")
                .attr("x", vis.width/3.5)
                .attr('y', vis.height*0.79)

            vis.eventDescPopup = vis.svg.append('text')
                .attr("x", vis.width/3.5)
                .attr('y', vis.width*0.83)
                .attr('font-size', 'medium')

            vis.overlays = vis.svg.selectAll(".overlay").data(vis.circleData)
            vis.overlays.enter().append("circle")
                .attr("cx",function(d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r;
                })
                .attr("cy",function (d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r) + r;
                })
                .attr("r",r*rfact)
                .style('opacity', 0)
                .attr("fill",'#FFFFFF')
                .on('click', function(event, d){
                    let circ = d3.select(`#circ-${d.split(' ').join('')}`);
                    if(circ.attr('fill')==='#3e76ec' || circ.attr('fill')==='grey') { // condition on first or second click on object
                        d3.selectAll(`.circle${vis.type}`)
                            .style('opacity', opacity-0.1)
                            .attr('fill', 'grey')
                            .attr('stroke', undefined)
                        circ.attr('stroke-width', '3px')
                            .attr('stroke', 'black')
                            .style("opacity", 1)
                            .attr('fill', '#ffce01')

                        vis.divider.style('stroke', '#3e76ec')
                        vis.bigCircle.style('opacity', opacity);
                        vis.bigPicture.attr("xlink:href", `img/icons/${d}.png`);
                        vis.bigPicture.style('opacity', 1)
                        vis.eventTitlePopup.text(d);
                        vis.eventDescPopup.text("Sample description goes here");

                    }
                    else{
                        d3.selectAll(`.circle${vis.type}`)
                            .style('opacity', opacity)
                            .attr('fill', '#3e76ec')
                        circ.attr('stroke-width', '0px')
                            .attr('stroke', undefined)
                            .style("opacity", opacity)
                            .attr('fill', color)
                        vis.divider.style('stroke', 'white')
                        vis.bigCircle.style('opacity', 0);
                        vis.bigPicture.style("opacity", 0);
                        vis.eventTitlePopup.text('');
                        vis.eventDescPopup.text("");
                    }

                });
        }



        vis.wrangleData()
    }



    wrangleData() {
        let vis = this;

        vis.updateVis()
    }



    updateVis() {
        let vis = this;


    }




}