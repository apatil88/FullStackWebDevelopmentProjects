var mongoose = require("mongoose");

//CAMPGROUND SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name : String,
   price: String,
   image : String,
   description : String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [           //Associate comments with campground. Each campground stores references of comments
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
         }
      ]
});

//Compile to model
module.exports = mongoose.model("Campground", campgroundSchema);