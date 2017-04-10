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
                  //Associate user with a comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  
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

//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})  //Id here refers to campground id 
        }
    })
   
});

//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
     if(err){
         console.log(err);
         res.redirect("back");
     }  else {
         res.redirect("/campgrounds/"+req.params.id);
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
