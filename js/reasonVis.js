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
            document.getElementById("original").innerHTML = "            <div class=\"container-fluid\">\n" +
                "                <div class = \"col-12 center\" style = \"height: 100px\">\n" +
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