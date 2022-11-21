/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let selCountry = 'Worldwide';

let dataStar;

// load data using promises
let promises = [
    d3.csv('data/clean_results.csv', (row) => {
        // convert string to numerical and date data types
        row.Clean_Result = +row.Clean_Result;

        let parseTime = d3.timeParse("%Y");
        row.Year = parseTime(row.Year);

        return row;
    }),
    d3.csv('data/continent_mapping.csv'),
];

// data loadiing
Promise.all(promises)
    .then(function (data) {
        dataStar = data
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initialize Main Page
function initMainPage(data) {
    console.log(data)
    circleVis = new CircleVis('eventsVis', data[0], undefined, 1)

    highJumpVis = new HighJumpVis('hurdleVis', data[0])
    runningVis = new RunningVis('runningVis', data[0])
    treeVis = new TreeVis('treeVis', data[0], data[1])
    dashMedals = new DashMedals('dashMedals', data[0], data[1])
    dashBar1 = new DashBar('dashBar1',data[0], 'Year')
    dashBar2 = new DashBar('dashBar2',data[0], 'Event')
    // syringeVis = new SyringeVis('syringevis',data[0])
    // lineGraph = new LineGraph('lineGraph',data[0])
    circleVis = new CircleVis('reasonsVis',data[0],["Doping","Equipment","Training","Diet","Coaching","Global Access"], 2)
    mapVis = new MapVis('mapVis', data[0])
};

function highJumpGenderChange(){
    highJumpVis.updateSlider();
    highJumpVis.wrangleData();
}

function runningGenderChange(){
    runningVis.wrangleData()
}

function syringeUp(){
    syringeVis.fillUp();
    syringeVis.updateVis();
    lineGraph.fillUp();
    lineGraph.updateVis();
}

function syringeDown(){
    syringeVis.emptyDown();
    syringeVis.updateVis();
    lineGraph.emptyDown();
    lineGraph.updateVis();
}

function resetToWorld(){
    selCountry = 'Worldwide';
    dashMedals.wrangleData();
    dashBar1.wrangleData();
    dashBar2.wrangleData();
    treeVis.resetColors();
    document.getElementById("resetbutton").disabled = true;

}

function expandReason(reason, data){
    console.log(reason)
    console.log(data)
    reasonVis = new ReasonVis('reasonsVis', dataStar,reason);
    syringeVis = new SyringeVis('syringevis',dataStar[0])
    lineGraph = new LineGraph('lineGraph',dataStar[0])
}


function mainPage(data){
    let div = document.getElementById('original');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    document.getElementById("original").innerHTML="<div class=\"row phase 5a\">\n" +
        "                    <div class = \"row center olympicBodyText\" style = \"padding-top: 30px;\">\n" +
        "                        <div class  = \"col circlesContain\" id=\"reasonsVis\">\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>"
    circleVis = new CircleVis('reasonsVis',data,["Doping","Equipment","Training","Diet","Coaching","Global Access"], 2)

}

