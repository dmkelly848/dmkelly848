/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions

// load data using promises
let promises = [
    d3.csv('data/clean_results.csv')
];

d3.csv("data/clean_results.csv", (row) => {
    // convert string to numerical and date data types
    row.Clean_Result = +row.Clean_Result;

    let parseTime = d3.timeParse("%Y");
    row.Year = parseTime(row.Year);

    return row;
}).then( (data) => {
    highJumpVis = new HighJumpVis('hurdleVis', data)
    runningVis = new RunningVis('runningVis', data)
})

function highJumpGenderChange(){
    d3.select()
    highJumpVis.initVis();
}

