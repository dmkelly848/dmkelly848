/* * * * * * * * * * * * * *
*      CIRCLES Vis          *
* * * * * * * * * * * * * */
/*This contains code for the circular visualizations we use in several cases. It spaces out the circles dynamically
 and is used for our "events" and "reason" visualizationns*/

class CircleVis {

    constructor(parentElement, resultsData, circleData, descData, type) {
        this.parentElement = parentElement;
        this.circleData = circleData;
        this.resultsData = resultsData;
        this.descData = descData;

        //Type 1 is our track and fields events vis; Type 2 is our reasons vis,
        this.type = type;
        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 20, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        //define type-dependent variables
        let circsPerRow;
        let color, fontsize, padfact, rfact, opacity, r;
        if(vis.type===1) {
            circsPerRow = 9;
            padfact = 2.2;
            color = '#BCCDF3';
            opacity = 0.95;
            fontsize = 'small';
            rfact = 1.3;
            vis.margin = {top: 20, right: 20, bottom: 30, left: 20};
            vis.circleData = [...new Set(vis.resultsData.map(d => d.Event))];

            r = Math.min(vis.width/(circsPerRow*4), vis.height/((vis.circleData.length/circsPerRow)*6));
            // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
        }
        else{
            circsPerRow = 3;
            padfact = 2;
            rfact = 1;
            r = vis.width/(circsPerRow*4)
            opacity = 1;
            fontsize = 'normal'
            color = '#ffb5b5'
        }

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
                .attr("xlink:href", d=>`img/icons/${d}.png`)
                .attr("x",function (d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r - r*2/3;
                })
                .attr("y", function(d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r+r/3) ;
                })
                .attr('height', 1.3*r)
                .attr('width', 1.3*r);

            vis.tooltip = d3.select("body").append('div')
                .attr('class', "tooltip")
                .attr('id', 'reasonsTooltip')


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
                .attr("fill",'#ff0000')
                .on("mouseover",function(event,d){
                    d3.select(this)
                        .attr('stroke-width', '2px')
                        .attr('stroke', 'black')
                        .style("opacity", 0.5)
                    vis.tooltip // adds tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                     <div style="font-size: 30px;text-align: left; border: thin solid grey; border-radius: 5px; background: lightgrey; padding-top: 10px; padding-right: 10px; padding-left: 10px">
                         <p class = "olympicHeadText" >${d}: </p>
                         <p class = "olympicBodyText"> Click to learn more!</p>
                     </div>`);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .attr('stroke-width', '0px')
                        .style("opacity", 0)
                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                })
                .on('click', function(event, d) {
                    let div = document.getElementById('original');
                    while(div.firstChild){
                        div.removeChild(div.firstChild);
                    }
                    vis.tooltip.style("opacity",0)
                    expandReason(d, vis.resultsData);
                })



        }
        else if (vis.type ===1){
            vis.icons = vis.svg.selectAll(".icon").data(vis.circleData)
            vis.icons.enter().append("svg:image")
                .attr("class","icon")
                .attr("xlink:href", d=>`img/icons/${d}.png`)
                .attr("x",function (d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r-1.5*r/2;
                })
                .attr("y", function(d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r+r/4);
                })
                .attr('height', 1.5*r)
                .attr('width', 1.5*r);

            let placement = 0.6;

            vis.divider = vis.svg.append('line')
                .style("stroke-width", 2)
                .attr("x1", 0)
                .attr("y1", vis.height*placement)
                .attr("x2", vis.width)
                .attr("y2", vis.height*placement);

            vis.bigCircle = vis.svg.append('circle')
                .style("fill", "#BCCDF3")
                .style('opacity', 0)
                .attr("r", r*2.5)
                .attr("cy", vis.height*placement+3.5*r)
                .attr("cx", 3*r)

            vis.bigPicture = vis.svg.append('svg:image')
                .attr("class","icon")
                .attr("y", vis.height*placement+3.5*r-1.6875*r)
                .attr('x', 3*r-1.6875*r)
                .attr('height', 3.375*r)
                .attr('width', 3.375*r);

            vis.eventTextGroup = vis.svg.append('g')
                .attr('transform', `translate(${vis.width/5}, ${vis.height*(placement*1.15)})`)

            vis.eventTitlePopup = vis.eventTextGroup.append('text')
                .attr("class","olympicHeadText")
                .attr('font-size', 'larger')
                .attr("x", 0)
                .attr('y', 0)

            vis.eventDescPopup = vis.eventTextGroup.append('foreignObject')
                .attr('x',0)
                .attr('y', 15)
                .attr('width', vis.width-vis.width/3.5)
                .attr('height', vis.height-vis.height*(placement*1.12)-20)
                .attr('font-size', '45%')
                .append("xhtml:p")


            vis.overlays = vis.svg.selectAll(".overlay").data(vis.circleData)
            vis.overlays.enter().append("circle")
                .attr("cx",function(d,i){
                    return (i%circsPerRow * vis.width/circsPerRow) + padfact*r;
                })
                .attr("cy",function (d,i){
                    return (Math.floor(i/circsPerRow) * (padfact+1) * r) + r;
                })
                .attr('class', 'overlay')
                .attr("r",r*rfact)
                .style('opacity', 0)
                .attr("fill",'#FFFFFF')
                .on('click', function(event, d){
                    let circ = d3.select(`#circ-${d.split(' ').join('')}`);
                    if(circ.attr('fill')==='#BCCDF3' || circ.attr('fill')==='grey') { // condition on first or second click on object
                        d3.selectAll(`.circle${vis.type}`)
                            .style('opacity', opacity-0.5)
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
                        vis.eventDescPopup.text(vis.descData.find(datum => datum['event'] === d).description);

                    }
                    else{
                        d3.selectAll(`.circle${vis.type}`)
                            .style('opacity', opacity)
                            .attr('fill', '#BCCDF3')
                        circ.attr('stroke-width', '0px')
                            .attr('stroke', undefined)
                            .style("opacity", opacity)
                            .attr('fill', color)
                        vis.divider.style('stroke', 'none')
                        vis.bigCircle.style('opacity', 0);
                        vis.bigPicture.style("opacity", 0);
                        vis.eventTitlePopup.text('');
                        vis.eventDescPopup.text("");
                    }
                });
        }
        vis.wrangleData()
    }
    //Following functions are not necessary, keeping pipeline if we make future changes
    wrangleData() {
        let vis = this;
        vis.updateVis()
    }
    updateVis() {
        let vis = this;
    }
}