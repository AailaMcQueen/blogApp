var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");
var middleware = require("../middleware");


router.post("/blogs/:id/comments",middleware.isLoggedIn, function(req, res){
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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          blog.comments.push(comment);
          blog.save();
          res.redirect("/blogs/"+blog._id);
        }
      })
    }
  })
});

router.get("/blogs/:id/comments/:comment_id/edit",middleware.commentOwns, function(req, res){
  Comment.findById(req.params.comment_id, function(error, foundComment){
    if(error){
      res.redirect("back");
    }
    else{
     res.render("editComment", {blog_id: req.params.id, comment: foundComment});
    }
  })

});

router.put("/blogs/:id/comments/:comment_id",middleware.commentOwns, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updateComment){
    if(error){
      res.redirect("back");
    }
    else{
      res.redirect("/blogs/"+req.params.id)
    }
  })
});

router.delete("/blogs/:id/comments/:comment_id", middleware.commentOwns, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(error){
    if(error){
    req.flash("error","Something Went Wrong!!");
       res.redirect("/blogs/"+req.params.id);
    }
    else{
      req.flash("warning","Comment Deleted!!");
      res.redirect("/blogs/"+req.params.id);
    }
  })
});

module.exports = router;
