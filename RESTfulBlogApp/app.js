var express  = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    moment   = require("moment"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
var app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));  //To serve custom CSS
app.use(bodyParser.urlencoded({extended : true}));  //For parsing the HTTP request body when a form is submitted
app.use(methodOverride("_method"));   //To handle PUT requests. HTML form do not support PUT and DESTROY methods. They only support GET and POST methods.
app.use(expressSanitizer());

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
    //Sanitize the request body
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
   });
});

//SHOW ROUTE  : GET
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
});

//EDIT ROUTE : GET
app.get("/blogs/:id/edit", function(req, res){
    //Find the id of the blog to be added
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err) {
           res.redirect("/");
       } else {
           res.render("edit", {blog : foundBlog});
       }
    });
        
});

//UPDATE ROUTE : PUT
app.put("/blogs/:id", function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DELETE ROUTE : DELETE
app.delete("/blogs/:id", function(req, res){
    //Delete blog and redirect
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("RESTfulBlogApp started on port " + process.env.PORT); 
});
