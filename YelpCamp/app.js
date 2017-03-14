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
   image : String,
   description : String
});

//Compile to model
var Campground = mongoose.model("Campground", campgroundSchema);

//Create and save new campground to database
// Campground.create({
//         name : "Wye Valley Camping", 
//         image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg",
//         description : "This is a great valley! Love to be here again!"
// }, function(err, campgrounds){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("New Campground created in DB");
//         console.log(campgrounds);
//     }
// });


app.get("/",  function(req, res){
    res.render("landing");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
      
       //Get all campgrounds from database
       Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          } else {
              res.render("index", {campgrounds : allCampgrounds});  //Retrieves all campgrounds from DB and renders it on campgrounds page
          }
       });
       
});

//Extract name and image from the POST request sent from the form
//CREATE - Add new campground to database
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name : name, image : image, description: desc};
    
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
//NEW - Show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});

//SHOW - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           //render show template with that campground
            res.render('show', {campground : foundCampground});
       }
    });
      
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});