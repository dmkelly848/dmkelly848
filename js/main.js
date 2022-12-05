/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */
// set up fullpage.js
new fullpage('#fullpage', {
    //options here
    autoScrolling:true,
    scrollHorizontally: true,
    fitToSection: true,
    parallax: true,

    // Navigation
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: [
        'Intro',
        'Usain Bolt',
        'Overview',
        'Event Descriptions',
        'Medal Breakdown ',
        'Trends',
        'Running Faster',
        'Jumping Higher',
        'Breaking Records',
        'Why',
        'Reasons',
    'Our Team',
    'Acknowledgements and Sources'],
    showActiveTooltip: false
});

// init global variables, switches, helper functions
let selCountry = 'Worldwide';
let dataStar;
let mapYearIndex = 0;

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
    d3.csv('data/event_descriptions.csv'),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.csv('data/hosts.csv'),
    d3.csv('data/records.csv'),
    d3.csv('data/mens_records.csv'),
    d3.csv('data/womens_records.csv'),
];

/*This data was pulled from our main dataset (using Python). A 1 at (i,j) means that the record for event i was broken
in year j*/
let mensRecordMatrix = [
    [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0]
]

let womensRecordMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
]

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

    bandVis = new BandVis('icon-bottom-bar', data[0])
    circleVis = new CircleVis('eventsVis', data[0], undefined, data[2], 1)
    highJumpVis = new HighJumpVis('hurdleVis', data[0])
    runningVis = new RunningVis('runningVis', data[0])
    treeVis = new TreeVis('treeVis', data[0], data[1])
    dashMedals = new DashMedals('dashMedals', data[0], data[1])
    dashBar1 = new DashBar('dashBar1',data[0], data[1], 'Year')
    dashBar2 = new DashBar('dashBar2',data[0], data[1], 'Event')
    circleVis2 = new CircleVis('reasonsVis',data[0],["Doping","Equipment","Training","Diet","Coaching","Global Access"], undefined, 2)
    mapVis = new MapVis('mapVis', data[0], data[3], data[4])
    recordsLineVis = new RecordsLineVis('recordsLinesVis', data[0], data[5], data[4])
};

//Called when user changes gender in high jump vis
function highJumpGenderChange(){
    highJumpVis.updateSlider();
    highJumpVis.wrangleData();
}

//Called when user changes gender in 100 m dash vis
function runningGenderChange(){
    runningVis.wrangleData()
}

//Called when user "fills" the syringe in doping vis
function syringeUp(){
    syringeVis.fillUp();
    syringeVis.updateVis();
    lineGraph.fillUp();
    lineGraph.updateVis();
}

//Called when user "empties" the syringe in doping vis
function syringeDown(){
    syringeVis.emptyDown();
    syringeVis.updateVis();
    lineGraph.emptyDown();
    lineGraph.updateVis();
}

//Called when unselects country in tree visual to look at the world
function resetToWorld(){
    selCountry = 'Worldwide';
    dashMedals.wrangleData();
    dashBar1.wrangleData();
    dashBar2.wrangleData();
    treeVis.resetColors();
    document.getElementById("resetbutton").disabled = true;

}

//Called when user selects a reason in the "why is this the case" panel
//Changes html and javascript code that is called
function expandReason(reason, data){
    reasonVis = new ReasonVis('reasonsVis', dataStar,reason);
    if(reason==="Doping"){
        syringeVis = new SyringeVis('syringevis')
        lineGraph = new LineGraph('lineGraph',dataStar[0])
    }else if(reason==="Equipment"){
        equipVis = new EquipmentVis('equip');
    }else if(reason ==="Diet"){
        dietVis = new DietVis('dietVis')
    }else if(reason === 'Global Access'){
        globalAccessVis = new GlobalLineVis("globLinVis")
    }
}

//Called when user moves to previous Olympic games in globe visual
function previousGames(){
    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex !== 0){
        mapYearIndex -= 1;
        document.getElementById('previousGames').style.visibility = 'visible'
    }

    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex === 0){
        document.getElementById('previousGames').style.visibility = 'hidden'
    }

    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex !== 27){
        document.getElementById('nextGames').style.visibility = 'visible'
    }

    document.getElementById('gamesYear').innerHTML = dataStar[4][mapYearIndex].Year
    document.getElementById('hostCountryText').innerHTML = 'Host: ' + dataStar[4][mapYearIndex].Host

    mapVis.spinVis()
    recordsLineVis.wrangleData()
}

//Called when user moves to next Olympic games in globe visual
function nextGames(){

    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex !== 27){
        mapYearIndex += 1;
        document.getElementById('nextGames').style.visibility = 'visible'
    }

    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex === 27){
        document.getElementById('nextGames').style.visibility = 'hidden'
    }

    // https://stackoverflow.com/questions/8685107/hiding-a-button-in-javascript
    if (mapYearIndex !== 0){
        document.getElementById('previousGames').style.visibility = 'visible'
    }

    document.getElementById('gamesYear').innerHTML = dataStar[4][mapYearIndex].Year
    document.getElementById('hostCountryText').innerHTML = 'Host: ' + dataStar[4][mapYearIndex].Host

    mapVis.spinVis()
    recordsLineVis.wrangleData()
}


//Called when a user gose "back to reasons" and views all 6 once more
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
    circleVis2 = new CircleVis('reasonsVis',data,["Doping","Equipment","Training","Diet","Coaching","Global Access"], undefined, 2)
}

d3.interval(slide, 2000)
function slide(){
    bandVis.wrangleData()
}
