var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {};

//Middleware to check if the user is logged in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

//Middleware to check campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //If user is logged in 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("back"); 
            } else {
                //If user owns the campground
                if(foundCampground.author.id.equals(req.user._id)){
                   next();  //render edit form
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back"); //if user is not authorized to edit, redirect to previous page
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");  //If the user is not logged in
    }
}


//Middleware to check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
    //If user is logged in 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("back"); 
            } else {
                //If user owns the comment
                if(foundComment.author.id.equals(req.user._id)){
                   next();  //render edit form
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back"); //if user is not authorized to edit, redirect to previous page
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");  //If the user is not logged in
    }
}

module.exports = middlewareObj;