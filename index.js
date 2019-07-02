var express = require("express");
var methodOverride = require("method-override");
var app = express();
var expressSanitizer = require("express-sanitizer");
var mongoose= require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/blogApp", {useNewUrlParser: true});
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.listen(process.env.PORT||3000, function(){
  console.log("App is Launched");
});
var Blog = require("./models/blogs");
var seedDB = require("./seeds")

app.get("/blogs", function(req, res){
  Blog.find({}, function(error, blogs){
    if(error){
      console.log(error);
    }
    else {
      res.render("index",{ blogs: blogs});
    }
  });
});
app.get("/blogs/new", function(req, res){
  res.render("new");
});
app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(error, newBlog){
    if(error){
      res.render("/blogs/new");
    }
    else{
      res.redirect("/blogs");
    }
  })
});

app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id).populate("comments").exec(function(error, foundBlog){
    if(error){
      res.redirect("/blogs");
    }
    else {
      res.render("show", {blog: foundBlog});
    }
  })
});

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(error, foundBlog){
    if(error){
      res.redirect("/blogs");
    }
    else{
      res.render("edit", {blog: foundBlog});
    }
  })
});

app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
    if(error){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs/"+req.params.id)
    }
  })
});

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(error){
    if(error){
       res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  })
});


app.get("/", function(req, res){
  res.redirect("/blogs");
});
