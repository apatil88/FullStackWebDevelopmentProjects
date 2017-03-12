var express = require("express");
var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");

//TODO : Move to MongoDB database
var campgrounds = [
       {name : "Beach camping", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
       {name : "Wye Valley Camping", image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
       {name : "Camp", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"}
       
       ]; 

app.get("/",  function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
       res.render("campgrounds", {campgrounds : campgrounds});
});

//Extract name and image from the POST request sent from the form
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name : name, image : image};
    campgrounds.push(newCampground);
    
    //redirect to campgrounds page
    res.redirect("/campgrounds");  //Default redirect : GET
});

//Renders a form to create a new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});