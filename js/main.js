/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let selCountry = 'Worldwide';

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
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initialize Main Page
function initMainPage(data) {
    console.log(data)

    highJumpVis = new HighJumpVis('hurdleVis', data[0])
    runningVis = new RunningVis('runningVis', data[0])
    treeVis = new TreeVis('treeVis', data[0], data[1])
    dashMedals = new DashMedals('dashMedals', data[0], data[1])
    dashBar1 = new DashBar('dashBar1',data[0], 'Year')
    dashBar2 = new DashBar('dashBar2',data[0], 'Event')
    syringeVis = new SyringeVis('syringevis',data[0])
    lineGraph = new LineGraph('lineGraph',data[0])
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
}

function syringeDown(){
    syringeVis.emptyDown();
    syringeVis.updateVis();
}

function resetToWorld(){
    selCountry = 'Worldwide';
    dashMedals.wrangleData();
    dashBar1.wrangleData();
    dashBar2.wrangleData();
    treeVis.resetColors();
    document.getElementById("resetbutton").disabled = true;

}

