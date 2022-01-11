require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to the classroom!";
const aboutContent = "Only the teacher is allowed to compose updates and NO student!";
const contactContent = "Mail ID - teacher@123.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://GeekyGaurab:" + process.env.MONGODB_PASSWORD + "@cluster0.4q1uo.mongodb.net/updatesDB");

const blogSchema = {
  title: {
    type: String,
    required: [true, "Post must have a title!"]
  },
  post: {
    type: String,
    required: [true, "Post must have some content!"]
  }
};

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
  Blog.find({}, function(err, results) {
    res.render("home", {
      startingContent: homeStartingContent,
      blogs: results
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const title = req.body.postTitle;
  const post = req.body.postBody;

  const blog = new Blog({
    title: title,
    post: post
  });

  blog.save(function(err) {
    if(!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

app.get("/blogs/:id", function(req, res){
  const requestedId = req.params.id;

  Blog.findById(requestedId, function(err, blog) {
    if(!err) {
      res.render("post", {
        title: blog.title,
        post: blog.post
      });
    } else {
      console.log(err);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
