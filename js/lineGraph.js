/* * * * * * * * * * * * * *
*      LineGraph Vis          *
* * * * * * * * * * * * * */

//This is the line graph visual in the syringe visualizations
class LineGraph {

    constructor(parentElement, resultsData) {
        this.parentElement = parentElement;
        this.resultsData = resultsData;
        this.formatDate = d3.timeFormat("%Y");

        //States represent various full states of visualization. There is an identical var in "syringeVis"
        this.state = 0;
        this.colorScale = ["#ff0000","#179a13","#3e76ec"]

        this.initVis()
    }

    initVis() {
        let vis = this;

        // margin convention with static height and responsive/variable width
        vis.margin = {top: 30, right: 20, bottom: 30, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.center = {'x': vis.width/2, 'y': vis.height/2};

        // // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.VERTSHIFT = 70;
        vis.y = d3.scaleLinear()
            .range([vis.height,vis.VERTSHIFT]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.x = d3.scaleTime()
            .range([0,vis.width]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.svg.append("g")
            .attr("class", "y-axis axis axisText");

        vis.svg.append("g")
            .attr("class", "x-axis axis axisText")
            .attr("transform", "translate(0," + vis.height+ ")");

        //Lines and highlighted region to show designated time period
        vis.group = vis.svg.append("g")
            .attr("x",0)
            .attr("y",0)
            .attr("id", "tool");

        vis.hoverL = vis.group
            .append("line")
            .attr("stroke", "#000000")
            .attr("stroke-dasharray","4 1 2 3")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", vis.VERTSHIFT).attr("y2", vis.height);

        vis.hoverR = vis.group
            .append("line")
            .attr("stroke", "#000000")
            .attr("stroke-dasharray","3")
            .attr("stroke-width",5)
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", vis.VERTSHIFT).attr("y2", vis.height);

        vis.area = vis.svg.append("rect")

        //Chart title
        vis.svg.append("text")
            .attr("x",0)
            .attr("y",0)
            .text("Average Throwing Distances (m.) of Male")
            .attr("class","olympicHeadText chartTitle")

        vis.svg.append("text")
            .attr("x",vis.width/4)
            .attr("y",40)
            .text("Olympians by Year")
            .attr("class","olympicHeadText chartTitle")

        vis.wrangleData()
    }


    //Collects data for throwing events
    wrangleData() {
        let vis = this;

        let filterGenderDat = vis.resultsData.filter(function (d){
            return (d.Gender === 'M')
        });

        vis.discusData = [];
        vis.javelinData = [];
        vis.hammerData = [];

        vis.legendKeys = ["Javelin Throw",'Discus Throw','Hammer Throw']

        // get only  jump results
        filterGenderDat.forEach((element) => {
            if(element.Event === 'Javelin Throw'){
                vis.javelinData.push(element);
            }else if(element.Event === 'Hammer Throw'){
                vis.hammerData.push(element);
            }else if(element.Event === 'Discus Throw') {
                vis.discusData.push(element);
            }
        })

        //Format data for line graph
        let javTemp = d3.rollup(vis.javelinData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        let disTemp = d3.rollup(vis.discusData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        let hamTemp = d3.rollup(vis.hammerData, v => d3.mean(v, d => d.Clean_Result), d => d.Year)
        vis.javelinData = Array.from(javTemp).map(([key, value]) => ({key, value}));
        vis.discusData = Array.from(disTemp).map(([key, value]) => ({key, value}));
        vis.hammerData = Array.from(hamTemp).map(([key, value]) => ({key, value}))

        vis.displayData = [vis.javelinData,vis.discusData,vis.hammerData]

        let max = Math.max(d3.max(vis.javelinData, d => d.value))
        vis.x.domain([d3.min(vis.discusData, d=>d.key),d3.max(vis.discusData, d=>d.key)])
        vis.y.domain([0, max+0.5]);

        //Line graph
        vis.line = vis.svg.selectAll(".lin").data(vis.displayData)

        vis.line.enter().append("path")
            .attr("class","lin")
            .attr("d",d3.line()
                .x(function(d) { return vis.x(d.key)  })
                .y(function(d) { return vis.y((d.value))})
            )
            .attr("fill","none")
            .attr("stroke", function(d,i){
                return vis.colorScale[i]
            })
            .attr("stroke-width", 5.0);

        //Dynamic tooltips
        vis.group2 = vis.svg.append("g")
            .attr("x",0)
            .attr("y",0)
            .attr("id", "tools55");

        let hover = vis.group2
            .append("line")
            .attr("stroke", "#5b5b5b")
            .attr("stroke-dasharray","4 1 2 3")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", 0).attr("y2", vis.height);

        vis.javCirc = vis.group2
            .append("circle")
            .attr("class","tools")
            .attr("cx",20)
            .attr("cy",-20).style('fill','white').style("stroke","black")
            .attr('r',vis.width/40)
            .attr('opacity',0);

        vis.discCirc = vis.group2
            .append("circle")
            .attr("class","tools")
            .attr("cx",20)
            .attr("cy",-5).style('fill','white').style("stroke","black")
            .attr('r',vis.width/40)
            .attr('opacity',0);

        vis.hamCirc = vis.group2
            .append("circle")
            .attr("class","tools")
            .attr("cx",20)
            .attr("cy",-15).style('fill','white').style("stroke","black")
            .attr('r',vis.width/40)
            .attr('opacity',0);

        vis.javText = vis.group2
            .append("text")
            .attr("class","tools")
            .attr("class","olympicBodyText")
            .attr("id","jav")
            .attr("x",10)
            .attr("y",-15).style('fill','red');
        vis.discText = vis.group2
            .append("text")
            .attr("class","tools")
            .attr("class","olympicBodyText")
            .attr("id","disc")
            .attr("x",10)
            .attr("y",0).style('fill','green');
        vis.hamText = vis.group2
            .append("text")
            .attr("class","tools")
            .attr("class","olympicBodyText")
            .attr("id","ham")
            .attr("x",10)
            .attr("y",-10).style('fill','blue')

        let dateText = vis.group2
            .append("text")
            .attr("class","tools")
            .attr("class","labelfont")
            .attr("id","date")
            .attr("x",10)
            .attr("y",vis.height-10);

        let temp = vis.svg.append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("class","listener")
            .attr("width",vis.width)
            .attr("height",vis.height)
            .attr("fill-opacity","0%");

        temp.on("mouseover", function(event, d){
            document.getElementById("tools55").style.display = null;
        });

        temp.on("mouseout", function(event, d){
            document.getElementById("tools55").style.display = "none";
        });

        temp.on("mousemove", function(event, d){
            vis.mouseMove(event,vis.displayData);
        });

        vis.updateVis()
    }


    updateVis() {
        let vis = this;



        //The following p's correspond to various points in the doping timeline that we wish to represent
        vis.p1 = vis.x(new Date(1898,1,1))
        vis.p2 = vis.x(new Date(1952,1,1))
        vis.p3 = vis.x(new Date(1972,1,1))
        vis.p4 = vis.x(new Date(1988,1,1))
        vis.p5 = vis.x(new Date(2014,1,1))

        //Initial state
        if(vis.state ===0){
            vis.hoverR.transition().duration(800).attr("x1",vis.p2).attr("x2",vis.p2)
            vis.hoverL.transition().duration(800).attr("x1",vis.p1).attr("x2",vis.p1)
            vis.area.transition().duration(800).attr("width",vis.p2-vis.p1).attr("height",vis.height-vis.VERTSHIFT)
                .attr("x",vis.p1).attr("y",vis.VERTSHIFT).attr("fill","#ffce01").attr("fill-opacity",0.2)
        }

        //Color legend
        let lineLegend = vis.svg.selectAll(".lineLegend").data(vis.legendKeys)
            .enter().append("g")
            .attr("class","lineLegend")
            .attr("transform", function (d,i) {
                let shift =i*20 +4*vis.height/5
                return "translate(" + vis.width*2/3 + "," + shift+")";
            });

        lineLegend.append("text").text(function (d) {return d;})
            .attr("transform", "translate(15,9)")
            .attr("class","axisText"); //align texts with boxes

        lineLegend.append("rect")
            .attr("fill", function (d, i) {return vis.colorScale[i]; })
            .attr("width", 10).attr("height", 10);



        //Calling axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }


    //Moves hover bars rightward when you click "next"
    fillUp(){
        let vis = this;
        if(vis.state!==3){
            vis.state++;
            let hLx = vis.p1
            let hRx = vis.p2

            if(vis.state ===1){
                hLx = vis.p2;
                hRx = vis.p3;
            }else if (vis.state === 2 ){
                hLx = vis.p3;
                hRx = vis.p4;
            }else if (vis.state === 3){
                hLx = vis.p4;
                hRx = vis.p5;
            }
            vis.hoverL.transition().duration(800)
                .attr("x1",function(){return hLx;})
                .attr("x2",function(){return hLx;})

            vis.hoverR.transition().duration(800)
                .attr("x1",function(){return hRx;})
                .attr("x2",function(){return hRx;})

            vis.area.transition().duration(800)
                .attr("width",hRx-hLx)
                .attr("x",hLx)

        }

    }
    //Moves hover bars leftward when you click "back"
    emptyDown(){
        let vis = this;
        if(vis.state !== 0){
            vis.state--;

            let hLx = vis.p1
            let hRx = vis.p2

            if(vis.state ===1){
                hLx = vis.p2;
                hRx = vis.p3;
            }else if (vis.state === 2 ) {
                hLx = vis.p3;
                hRx = vis.p4;
            }
            vis.hoverL.transition().duration(800)
                .attr("x1",function(){return hLx;})
                .attr("x2",function(){return hLx;})

            vis.hoverR.transition().duration(800)
                .attr("x1",function(){return hRx;})
                .attr("x2",function(){return hRx;})

            vis.area.transition().duration(800)
                .attr("width",hRx-hLx)
                .attr("x",hLx)
        }
    }


    mouseMove(event,data){
        let vis = this;
        let bisectDate = d3.bisector(d=>d.key).left;
        let xval = d3.pointer(event)[0];
        let xdescale =new Date(vis.x.invert(xval));
        let ind = bisectDate(data[0], xdescale);
        let datPoint = data[0][ind];
        let datPoint2 = data[1][ind];
        let datPoint3 = data[2][ind];

        function vw(percent) {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            return (percent * w) / 100;
        }

        let xcoord = event.clientX - vw(54);
       vis.group2.attr("transform", "translate(" +xcoord + ", 0)")
        vis.javCirc.attr('opacity',1)
        vis.discCirc.attr('opacity',1)
        vis.hamCirc.attr('opacity',1)
        vis.javCirc.attr("transform", "translate( 0, "+ vis.y(datPoint.value) +" )")
        vis.javText.attr("transform", "translate( 0, "+ vis.y(datPoint.value) +" )")
        vis.discCirc.attr("transform", "translate( 0, "+ vis.y(datPoint2.value) +" )")
        vis.discText.attr("transform", "translate( 0, "+ vis.y(datPoint2.value) +" )")
        vis.hamCirc.attr("transform", "translate( 0, "+ vis.y(datPoint3.value) +" )")
        vis.hamText.attr("transform", "translate( 0, "+ vis.y(datPoint3.value) +" )")
        document.getElementById("jav").textContent = Math.round(datPoint.value);
        document.getElementById("disc").textContent = Math.round(datPoint2.value);
        document.getElementById("ham").textContent = Math.round(datPoint3.value);
        let dat = d3.timeFormat("%Y")
        document.getElementById("date").textContent=dat(datPoint.key);


    }
}