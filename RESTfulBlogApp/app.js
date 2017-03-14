var express  = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");
    
var app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));  //To serve custom CSS
app.use(bodyParser.urlencoded({extended : true}));  //For parsing the HTTP request body when a form is submitted

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title : {type: String, default: "Blog"},
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema); //Creates blogs collection in restful_blog_app database

//RESTFUL Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

/*Blog.create({
    title: "Blog",
    image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
    body: "Amazing!"
});*/

//INDEX route  : GET
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      if(err){
          console.log(err);
      } else {
          res.render("index", {blogs : blogs});  //Render data coming from database into view
      }
   });
});

//NEW Route : GET
app.get("/blogs/new", function(req, res){
    res.render("new");    
});

//CREATE Route : POST
app.post("/blogs", function(req, res){
   Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("RESTfulBlogApp started on port " + process.env.PORT); 
});