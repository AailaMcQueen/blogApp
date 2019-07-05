var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var Blog = require("../models/blogs");
var Comment= require("../models/comments"),
User = require("../models/users");


router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password,function(error, user){
    if(error){
      console.log(error);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
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
  res.redirect("/blogs");
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
