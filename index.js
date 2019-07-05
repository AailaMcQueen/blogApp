var express = require("express");
var methodOverride = require("method-override");
var app = express();
var expressSanitizer = require("express-sanitizer");
var mongoose= require("mongoose");
var passport = require('passport'),
localStrategy = require('passport-local');
var blogRoutes = require("./routes/blogs"),
commentRoutes =require("./routes/comments"),
indexRoutes = require("./routes/index");

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
var Comment= require("./models/comments"),
User = require("./models/users");

//passport config
app.use(require("express-session")({
  secret: "Jadara",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
app.use(blogRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


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

//auth routes
