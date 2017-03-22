var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js"),
    seedDB      = require("./seeds");
    
    
//Everytime this file runs, seed the database
seedDB();
    
//Connect to MongoDB database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");

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
              res.render("campgrounds/index", {campgrounds : allCampgrounds});  //Retrieves all campgrounds from DB and renders it on campgrounds page
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           console.log(foundCampground);
           //render show template with that campground
            res.render('campgrounds/show', {campground : foundCampground});
       }
    });
      
});

//==================
// COMMENTS ROUTES
//==================
//Nested Route
app.get("/campgrounds/:id/comments/new", function(req, res){
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {campground : campground});
       }
    });
  
});

app.post("/campgrounds/:id/comments", function(req, res){
   
   //Find campground by ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else {
          //Create comment
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  //Associate comment with campground
                  campground.comments.push(comment);
                  campground.save();
                  
                  //redirect to campground show page
                  res.redirect("/campgrounds/" + campground._id);
              }
          });
      }
   });
   
   
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});