var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js"),
    User        = require("./models/user.js"),
    seedDB      = require("./seeds");
    

var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");
    
    
//Everytime this file runs, seed the database
//seedDB();

//Flash messages
app.use(flash());

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

app.use(methodOverride("_method"));


//middleware to make current user available on all routes and templates
app.use(function(req, res, next){
   res.locals.currentUser = req.user; 
   next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

/* Shortening the routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);             //All campground routes begin with /campgrounds
app.use("/campgrounds/:id/comments", commentRoutes);   //All comments routes begin with /campgrounds/:id/comments
*/

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The YelpCamp server has started on ' + process.env.PORT); 
});