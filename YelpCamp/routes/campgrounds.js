var express = require("express");
var router = express.Router();

var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//INDEX - Show all campgrounds
router.get("/campgrounds", function(req, res){
      
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
router.post("/campgrounds",isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name : name, image : image, description: desc, author: author};
    
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
router.get("/campgrounds/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//SHOW - Shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
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

//EDIT CAMPGROUND ROUTE
//Using middleware check if user owns campground
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
           console.log(err);
           res.redirect("/campgrounds");
        } else {
           res.render("campgrounds/edit", {campground: foundCampground}); 
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    //Find and update campground and redirect to show page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


//Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

//Middleware to check campground ownership
function checkCampgroundOwnership(req, res, next){
    //If user is logged in 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("back"); 
            } else {
                //If user owns the campground
                if(foundCampground.author.id.equals(req.user._id)){
                   next();  //render edit form
                } else {
                    res.redirect("back"); //if user is not authorized to edit, redirect to previous page
                }
                
            }
        });
    } else {
        res.redirect("back");  //If the user is not logged in
    }
}

module.exports = router;