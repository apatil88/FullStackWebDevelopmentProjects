var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        title: "Forest",
        image: "https://farm4.staticflickr.com/3811/8993139225_575ca3fb17.jpg",
        description: "Amazing forest"
    },
    {
        title: "Beach Camping",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "Camping at the beach...bliss!"
    },
    {
        title: "Camping tent",
        image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: "Huge camping tent"
    }
]

function seedDB(){
    
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
        }
    });
    
    //add campgrounds
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else {
                console.log('added a campground');
                Comment.create({
                    text : "This place is great, but I wish there was internet",
                    author: "Homer"
                }, function(err, comment){
                   if(err){
                       console.log(err);
                   } else {
                       //Associate comment with campground
                       campground.comments.push(comment);
                       campground.save(function(err){
                           if(err){
                               console.log('While saving ' + err);
                           } else {
                               console.log('Comment created, associated with campground and saved in database');
                           }
                       });
                   }
                });
            }
        });
    });
    
    //add comments
}

module.exports = seedDB;