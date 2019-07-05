var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");

router.get("/blogs", function(req, res){
  Blog.find({}, function(error, blogs){
    if(error){
      console.log(error);
    }
    else {
      res.render("index",{ blogs: blogs, currentUser: req.user});
    }
  });
});
router.get("/blogs/new", isLoggedIn, function(req, res){
  res.render("new");
});
router.post("/blogs", isLoggedIn, function(req, res){
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  req.body.blog.author = author;
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

router.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id).populate("comments").exec(function(error, foundBlog){
    if(error){
      res.redirect("/blogs");
    }
    else {
      res.render("show", {blog: foundBlog});
    }
  })
});
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
