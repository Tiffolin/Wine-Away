var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Models
// var db = require("./models");
var PORT = 3000;

//Express
var app = express();

//Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
app.get("/wineApi", function(req, res) {
  // list of wines
  axios.get("https://www.lcbo.com/webapp/wcs/stores/servlet/en/lcbo/wine-14"). then(function(response) {

    var $ = cheerio.load(response.data);
    var results = []
    
    $("div.productChart").each (function(i,element){
        var title = $(element).find("a").text();
        var link = $(element).find("a"). attr("href");
    
        results.push({
            title:title,
            link:link
        });
    
    });
    console.log(results);
    })

});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
