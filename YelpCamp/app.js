var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
//Connect to MongoDB database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");


//CAMPGROUND SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name : String,
   image : String
});

//Compile to model
var Campground = mongoose.model("Campground", campgroundSchema);

//Create and save new campground to database
/*Campground.create({
        name : "Wye Valley Camping", 
        image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"
}, function(err, campgrounds){
    if(err){
        console.log(err);
    } else {
        console.log("New Campground created in DB");
        console.log(campgrounds);
    }
});*/


app.get("/",  function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
      
       //Get all campgrounds from database
       Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          } else {
              res.render("campgrounds", {campgrounds : allCampgrounds});  //Retrieves all campgrounds from DB and renders it on campgrounds page
          }
       });
       
});

//Extract name and image from the POST request sent from the form
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name : name, image : image};
    
    //Create and save the new campground submitted by the user to the DB
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");  //Default redirect : GET
       }
    });

    
   
});

//Renders a form to create a new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});