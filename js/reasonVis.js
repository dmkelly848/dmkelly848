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
            document.getElementById("original").innerHTML = "            <div class=\"container-fluid \"> <h3 class = \"olympicHeadText chartTitle\">Doping:</h3> \n" +
                "                <div class = \"col-12 center\" style = \"height: 100px\"> \n" +
                "                <button type=\"button\" onclick = mainPage() style = \"font-size = 30px\" >Back to Reasons</button>\n" +
                "            </div>\n" +
                "                <div class=\"row phase5b redText olympicBodyText\">\n" +
                "                    <div class=\"col-3\">\n" +
                "                        <div class = \"row center\" style = \"padding-left: 50px\">\n" +
                "                            <div class = \"col-6\">\n" +
                "                                <button type=\"button\" onclick = syringeDown()>Back</button>\n" +
                "                            </div>\n" +
                "                            <div class = \"col-6\">\n" +
                "                                <button type=\"button\" onclick = syringeUp()>Next</button>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div id = \"syringevis\" style=\"height:800px;\"></div>\n" +
                "                    </div>\n" +
                "                    <div class = \"col-9 olympicBodyText syringeText\">\n" +
                "                        <div class=\"container-fluid\">\n" +
                "                            <div class=\"row\">\n" +
                "                                <div class=\"col-4\">\n" +
                "                                   <div style = \"height:200px\"></div>\n" +
                "                                    <div id = \"text3\" class=\" \" style = \"height:130px\"></div>\n" +
                "                                    <div id = \"text2\" class=\" \" style = \"height:190px\"></div>\n" +
                "                                    <div id = \"text1\" class=\" \" style = \"height:130px\"></div>\n" +
                "                                    <div id = \"text0\" class=\" \" style = \"height:130px\"></div>\n" +
                "                                </div>\n" +
                "                                <div class=\"col-8\">\n" +
                "                                    <div id = \"lineGraph\" style=\"height:800px;\"></div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>"
        }else if(vis.reason === "Equipment"){
            //Insert HTML Code
            document.getElementById("original").innerHTML= "<div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\">\n" +
                "                <button type=\"button\" onclick = mainPage()>Back to Reasons</button>\n" +
                "            </div><div class=\"container-fluid\" style = \"padding-left: 100px; padding-right: 100px;\">\n" +
                "        <div class=\"row\">\n" +
                "            <h3 class = \"olympicHeadText chartTitle\">Equipment:</h3>\n" +
                "            <div class = \"col-4 centerText chartTitle\"> <span class = \"olympicHeadText\">1896 Athens Olympics</span>\n" +
                "                <div class=\" \" style = \"height:100px\"></div>\n" +
                "                <div id = \"texte1b\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"> </div>\n" +
                "                <div id = \"texte2b\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"></div>\n" +
                "                <div id = \"texte3b\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"></div>\n" +
                "            </div>\n" +
                "            <div class = \"col-4\" id =\"equip\" style=\"height:900px\"></div>\n" +
                "            <div class = \"col-4 centerText chartTitle\"> <span class = \"olympicHeadText\">Modern Olympics</span>\n" +
                "                <div class=\" \" style = \"height:100px\"></div>\n" +
                "                <div id = \"texte1a\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"></div>\n" +
                "                <div id = \"texte2a\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"></div>\n" +
                "                <div id = \"texte3a\" class=\"olympicBodyText\" style = \"height:200px; font-size: 22px\"></div>\n" +
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
                "        <div class=\"row olympicBodyText\" style = \"font-size: 28\">\n" +
                "            <div class=\"col \" style=\"padding: 70px 0;\" >\n" +
                "                <ul>\n" +
                "                    <li> Modern-day Olympic athletes are able to undergo training regimines that couldn't have been dreamed of in the 19th century.\n" +
                "                    </li>\n" +
                "                    <li> Prior to the advent of technology, Olympic athletes gauged their performances in numbers: race times, meters jumped, etc.</li>\n" +
                "                    <li>Now, Olympic contenders regularly undergo physical testing to measure their heart rates, lactic acid, and more, which enables them to more precisely record their athletic progress.</li>\n" +
                "                    <li>New suits are being developed that sense sweat content in real time to provide hydration guidelines.</li>\n" +
                "                </ul>\n" +
                "            </div>\n" +
                "            <div class=\"col\">\n" +
                "                <img src=\"img/img1.webp\" width = \"90%\">\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"row olympicBodyText\" style = \"font-size: 28; height: 400px\">\n" +
                "            <div class=\"col-5\">\n" +
                "                <img src=\"img/img2.webp\" width = \"80%\">\n" +
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
                "            </div>"


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