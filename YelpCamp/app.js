var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js"),
    User        = require("./models/user.js"),
    seedDB      = require("./seeds");
    
    
//Everytime this file runs, seed the database
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Once again Rusty wins the cutest!",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
//Connect to MongoDB database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));  //Serve the public directory for custom stylesheets

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
//Using middleware check if the user is logged in to add a comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {campground : campground});
       }
    });
  
});

//Using middleware prevent a user to add a comment by sending a POST request
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   
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

//==================
// AUTH ROUTES
//==================
// show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
   var newUser = new User({username : req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
       });
   })
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});

//handle login logic using a middleware
app.post("/login", passport.authenticate("local", {
   successRedirect : "/campgrounds",
   failureRedirect : "/login"
}), function(req, res){
    
});

//Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});