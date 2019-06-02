var cheerio = require ("cheerio");
var axios = require ("axios");

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
