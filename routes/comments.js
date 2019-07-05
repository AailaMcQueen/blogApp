var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");

router.post("/blogs/:id/comments", isLoggedIn, function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    }
    else{
      Comment.create(req.body.comment, function(error, comment){
        if(error){
          console.log(error);
        }
        else{
          blog.comments.push(comment);
          blog.save();
          res.redirect("/blogs/"+blog._id);
        }
      })
    }
  })
});
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
