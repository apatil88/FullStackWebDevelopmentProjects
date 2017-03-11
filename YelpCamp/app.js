var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/",  function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
   var campgrounds = [
       {name : "Beach camping", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
       {name : "Wye Valley Camping", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
       {name : "Camp", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"}
       
       ]; 
       res.render("campgrounds", {campgrounds : campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});