var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");
var middleware = require("../middleware");

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
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
  res.render("new");
});
router.post("/blogs",middleware.isLoggedIn, function(req, res){
  var author = {
    name: req.user.name,
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
      req.flash("error", "Blog Not Found!!");
      res.redirect("/blogs");
    }
    else {
      res.render("show", {blog: foundBlog});
    }
  })
});


router.get("/blogs/:id/edit",middleware.whoOwns, function(req, res){

    Blog.findById(req.params.id, function(error, foundBlog){
      if(error){
        req.flash("error", "Blog Not Found!!");
      }
      res.render("edit", {blog: foundBlog});
    });
  });

router.put("/blogs/:id",middleware.whoOwns, function(req, res){
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

router.delete("/blogs/:id",middleware.whoOwns, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(error){
    if(error){
       res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs");
    }
  })
});



module.exports = router;
