var express = require("express");
var router = express.Router();
//var router = express.Router({mergeParams:true});  //To make {id} available in comments route
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//==================
// COMMENTS ROUTES
//==================
//Nested Route
//Using middleware check if the user is logged in to add a comment
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
//Comments Create
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   
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

//Middleware to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}


module.exports = router;
