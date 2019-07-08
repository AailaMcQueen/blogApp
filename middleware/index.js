var middlewareObj = {};
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please Log In first!!");
  res.redirect("/login");
};

middlewareObj.whoOwns = function(req, res, next){
	  if(req.isAuthenticated()){
	    Blog.findById(req.params.id, function(error, foundBlog){
	    if(error){
		    req.flash("error", "Blog Not Found!!");
		    res.redirect("back");
	    }
	    else{
	      if(foundBlog.author.id.equals(req.user._id)){
	        next();
	      }
	      else{
	      	req.flash("error", "You are not allowed to do that!!");
	      res.redirect("back");
	      };
	    };
	});
	}
	else{
		req.flash("error", "You need to Log In first!!")
	  res.redirect("back");
}};


middlewareObj.commentOwns = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(error, foundComment){
    if(error){
    	req.flash("warning", "Something went wrong!!");
      res.redirect("back");
    }
    else{
      if(foundComment.author.id.equals(req.user._id)){
        next();
      }
      else{
      	req.flash("error", "You're not allowed to do that!!")
      res.redirect("back");
      };
    };
});
}
else{
	req.flash("error", "You need to be logged in!!")
  res.redirect("back");
}};

module.exports = middlewareObj;