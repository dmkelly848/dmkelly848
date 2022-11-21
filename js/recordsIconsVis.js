class RecordsIconsVis {

    constructor(parentElement, data, mensRecords, womensRecords) {
        this.parentElement = parentElement;
        this.data = data;
        this.mensRecords = mensRecords;
        this.womensRecords = womensRecords;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        //vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        let circsPerRow = 6;
        let color = '#3e76ec';
        let opacity = .35;
        let padfact = 2.2;
        let fontsize = 'small';
        let rfact = 1.3;
        // credit to: https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
        let r = 40




        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        vis.circleData = [...new Set(vis.data.map(d => d.Event))];

        vis.gender = d3.select("#records-gender").property("value")

        console.log(vis.gender)

        if (vis.gender === 'M') {
            vis.displayData = vis.mensRecords
            vis.displayData.forEach((row,index) => {
                vis.displayData[index]['Records'] = mensRecordMatrix[index]
            })
            vis.displayData['years'] = ['1896', '1900', '1904', '1908', '1912', '1920', '1924', '1928', '1932', '1936','1948', '1952', '1956', '1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988', '1992', '1996', '2000', '2004', '2008', '2012', '2016']
        } else if (vis.gender === 'W') {
            vis.displayData = vis.womensRecords
            vis.displayData.forEach((row,index) => {
                vis.displayData[index]['Records'] = womensRecordMatrix[index]
                vis.displayData['years'] = ['1928', '1932', '1936', '1948', '1952', '1956', '1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988', '1992', '1996', '2000', '2004', '2008', '2012', '2016']

            })
        }


        vis.updateVis()
    }

    updateVis() {
        let vis = this;

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
            .attr("r",r)
            .style('opacity', opacity)
            .attr("fill",color);

    }
}