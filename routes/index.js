var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");
var middleware = require("../middleware");

var rules={
  username: ["Username should contain 5-15 characters", "Username can only have lowercase alphanumeric characters and underscore"],
  password: ["Password must be of atleast 8 characters", "Password must contain one Uppercase, one lowercase letter and one number"]
};


router.get("/register", function(req, res){
  res.render("register", {rules: rules});
});

router.post("/register", function(req, res){
  User.register(new User({username: req.body.username, name: req.body.name, email: req.body.email}), req.body.password,function(error, user){
    if(error){
      console.log(error.message);
      req.flash("error", error.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success","Welcome to Your Blog: "+ user.name);
      res.redirect("/blogs");
    });
  });
});

//Login
router.get("/login", function(req, res){
  res.render("login");
});
router.post("/login",
          passport.authenticate("local",
          {
            successRedirect: "/blogs",
            failureRedirect: "/login"
          }),
          function(req, res){
});

//logout
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You're Logged Out!!")
  res.redirect("/blogs");
});

//middleware


module.exports = router;
