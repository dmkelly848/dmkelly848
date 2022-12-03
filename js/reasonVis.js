/* * * * * * * * * * * * * *
*      ReasonVis Vis          *
* * * * * * * * * * * * * */

class ReasonVis {

    constructor(parentElement , data, reason) {
        this.parentElement = parentElement;
        this.reason = reason;
        this.data = data;
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.initVis()
    }

    initVis() {
        let vis = this;
        console.log(vis.reason)

        if(vis.reason === "Doping"){

            console.log("doping chosen")
            document.getElementById("original").innerHTML = "            <div class=\"container-fluid\"> <h3 class = \"olympicHeadText chartTitle\">Doping:</h3> \n" +
                "                <div class = \"col-12 center\" style = \"height: 10vh\"> \n" +
                "                <button type=\"button\" onclick = mainPage() style = \"font-size = 30px\" >Back to Reasons</button>\n" +
                "            </div>\n" +
                "                <div class=\"row phase5b redText olympicBodyFont\">\n" +
                "                    <div class=\"col-3\">\n" +
                "                        <div class = \"row center\" style = \"padding-left: 50px\">\n" +
                "                            <div class = \"col-6\">\n" +
                "                                <button type=\"button\" onclick = syringeDown()>Back</button>\n" +
                "                            </div>\n" +
                "                            <div class = \"col-6\">\n" +
                "                                <button type=\"button\" onclick = syringeUp()>Next</button>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div id = \"syringevis\" style=\"height:80vh;\"></div>\n" +
                "                    </div>\n" +
                "                    <div class = \"col-9 olympicBodyFont syringeText\">\n" +
                "                        <div class=\"container-fluid\">\n" +
                "                            <div class=\"row\">\n" +
                "                                <div class=\"col-4\">\n" +
                "                                   <div style = \"height:20vh\"></div>\n" +
                "                                    <div id = \"text3\" class=\" \" style = \"height:12vh\"></div>\n" +
                "                                    <div id = \"text2\" class=\" \" style = \"height:19vh\"></div>\n" +
                "                                    <div id = \"text1\" class=\" \" style = \"height:13vh\"></div>\n" +
                "                                    <div id = \"text0\" class=\" \" style = \"height:13vh\"></div>\n" +
                "                                </div>\n" +
                "                                <div class=\"col-8\">\n" +
                "                                    <div id = \"lineGraph\" style=\"height:80vh;\"></div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>"
        }else if(vis.reason === "Equipment"){
            //Insert HTML Code
            document.getElementById("original").innerHTML= "<div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div><div class=\"container-fluid\" style = \"padding-left: 100px; padding-right: 100px;height:100vh\">\n" +
                "        <div class=\"row\">\n" +
                "            <h3 class = \"olympicHeadText chartTitle\">Equipment:</h3>\n" +
                "            <div class = \"col-4 centerText chartTitle\"> <span class = \"olympicHeadText\">1896 Athens Olympics</span>\n" +
                "                <div style= \"height: 10vh\"></div>\n" +
                "                <div id = \"texte1b\" class=\"olympicBodyText\" style = \"height:24vh; font-size: 18px\"> </div>\n" +
                "                <div id = \"texte2b\" class=\"olympicBodyText\" style = \"height:20vh; font-size: 18px\"></div>\n" +
                "                <div id = \"texte3b\" class=\"olympicBodyText\" style = \"height:22vh; font-size: 18px\"></div>\n" +
                "            </div>\n" +
                "            <div class = \"col-4\" id =\"equip\"></div>\n" +
                "            <div class = \"col-4 centerText chartTitle\"> <span class = \"olympicHeadText\">Modern Olympics</span>\n" +
                "                <div style= \"height: 10vh\"></div>\n" +
                "               <div id = \"texte1a\" class=\"olympicBodyText\" style = \"height:24vh; font-size: 18px\"></div>\n" +
                "                <div id = \"texte2a\" class=\"olympicBodyText\" style = \"height:20vh; font-size: 18px\"></div>\n" +
                "                <div id = \"texte3a\" class=\"olympicBodyText\" style = \"height:22vh; font-size: 18px\"></div>\n" +
                "            </div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>"

        }else if(vis.reason === "Training"){
            //Insert HTML code
            document.getElementById("original").innerHTML= "<div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div><div class=\"container-fluid\" style = \"padding-left: 100px; padding-right:100px\">\n" +
                "        <h3 class = \"olympicHeadText chartTitle\">Training:</h3>\n" +
                "        <div class=\"row olympicBodyText\" style = \"font-size: 2.5vh\">\n" +
                "            <div class=\"col \">\n" +
                "                <ul>\n" +
                "                    <li> Modern-day Olympic athletes are able to undergo training regimines that couldn't have been dreamed of in the 19th century.\n" +
                "                    </li>\n" +
                "                    <li> Prior to the advent of technology, Olympic athletes gauged their performances in numbers: race times, meters jumped, etc.</li>\n" +
                "                    <li>Now, Olympic contenders regularly undergo physical testing to measure their heart rates, lactic acid, and more, which enables them to more precisely record their athletic progress.</li>\n" +
                "                    <li>New suits are being developed that sense sweat content in real time to provide hydration guidelines.</li>\n" +
                "                </ul>\n" +
                "            </div>\n" +
                "            <div class=\"col\">\n" +
                "                <img src=\"img/img1.webp\" width = \"100%\">\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"row olympicBodyText\" style = \"font-size: 2.5vh; \">\n" +
                "            <div class=\"col-5\">\n" +
                "                <img src=\"img/img2.webp\" width = \"100%\">\n" +
                "            </div>\n" +
                "\n" +
                "            <div class=\"col-7\" style=\"padding: 70px 0;\" >\n" +
                "                <ul>\n" +
                "                    <li>Historically, many athletes were amateur and practiced part-time. With the advent of corporate sponsorships, prospective Olympians are prepared to make athletics their full-time endeavor.</li>\n" +
                "                    <li> Children are also being recruited at successively younger ages to train as athletes.\n" +
                "                    </li>\n" +
                "                </ul>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>"


        }else if(vis.reason === "Diet"){
            //Insert HTML code
            document.getElementById("original").innerHTML= "<div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div> <div class=\"container-fluid\" style = \"padding-left: 100px; padding-right:100px;\">\n" +
                "            <h3 class = \"olympicHeadText chartTitle\">Diet:</h3>\n" +
                "            <div class=\"row olympicBodyText\" style = \"font-size: 2.5vh; \">\n" +
                "                <div id= \"dietVis\" class=\"col-6\" style=\"padding: 20px;\" >\n" +
                "                </div>\n" +
                "                <div class=\"col-6 olympicBodyText\" style = \"padding-top: 100px; padding-left: 100px\">\n" +
                "                    <ul>\n" +
                "                        <li>The first nutritional vitamin was discovered and defined in 1926... 30 years after the first\n" +
                "                        modern Olympic Games.</li>\n" +
                "                        <li>The \"era of vitamin discovery\" continued through the 1950s. </li>\n" +
                "                        <li>It was not until the 1970s that vitamin supplements became commonplace.</li>\n" +
                "                        <li>Nutritional science has stagnated since the 1990s, but there are universal takeaways.</li>\n" +
                "                        <li>Olympians typically: Eat a lean, protein-filled breakfast; consume frequent small meals throughout\n" +
                "                        the day; hydrate often; and use vitamins to supplement their diets.</li>\n" +
                "                        <li>Fun Fact: Olympic Swimmer Michael Phelps aims to eat 8,000-10,000 calories per day. Depending on the event they compete in, athletes\n" +
                "                        have various diet plans to maximize performance.</li>\n" +
                "                    </ul>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>"


        }else if(vis.reason === "Coaching"){
            //Insert HTML code
            document.getElementById("original").innerHTML= "<div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div>"

        }else{
            //Insert HTML code
            document.getElementById("original").innerHTML= "<div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div>"
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