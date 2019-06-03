var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Models
var db = require("./models");
var PORT = 3000;

//Express
var app = express();

//Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
// app.get("/wines", function(req, res) {
//   // list of wines
//   axios.get("https://www.lcbo.com/webapp/wcs/stores/servlet/en/lcbo/wine-14"). then(function(response) {

//     var $ = cheerio.load(response.data);
//     var results = []
    
//     $("div.productChart").each (function(i,element){
//         var title = $(element).find("a").text();
//         var link = $(element).find("a"). attr("href");
    
//         results.push({
//             title:title,
//             link:link
//         });
    
//     });
//     console.log(results);
//     })

// });

app.get("/scrape", function(req, res) {
// list of wines
  axios.get("https://www.lcbo.com/webapp/wcs/stores/servlet/en/lcbo/wine-14").then(function(response) {

    var $ = cheerio.load(response.data);
    var results = {};
    $("div.product_name").each (function(i,element){
        results.img = $(element).find("div.product_image.img").attr("src");
        results.title = $(element).find("a").text();
        results.link = $(element).find("a"). attr("href");
    });
    $("div.product_image").each (function(i,element){
        results.img = $(element).find("img").attr("src");
    });

    db.Wine.create(results).then(function(dbWine){
        console.log(dbWine);
    })
        .catch(function(err) {
            console.log(err);
    });

    res.send("got the booze");
    });
});


// Route for getting all Wines
app.get("/wines", function(req, res) {
    db.Wine.find({})
      .then(function(dbWine) {
        res.json(dbWine);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  
 // Route for grabbing a specific wine and attatching N0te
app.get("/wines/:id", function(req, res) {
    db.Wine.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbWine) {
        res.json(dbWine);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  // Route for updating Wine with Note
  app.post("/wines/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Wine.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbWine) {
        res.json(dbWine);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});