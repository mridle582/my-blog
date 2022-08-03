require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect(`${process.env.MONGODB_URL}/myblogDB`);

const postsSchema = {
    title: String,
    body: String
};

const Post = mongoose.model("Post", postsSchema);

app.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                initHomeText: homeStartingContent,
                blogPosts: foundPosts
            });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        aboutText: aboutContent
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        contactText: contactContent
    });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/posts/:postTitle", (req, res) => {
    const qPostName = _.lowerCase(req.params.postTitle);

    Post.findOne({
        title: qPostName
    }, (err, qPost) => {
        console.log(qPost);
        if (err) {
            console.log(err);
        } else {
            if (qPost === null) {
                res.render("post", {
                    postTitle: "Ooops!",
                    postBody: "Could not find the desired page, please try again."
                });
            }else {
                res.render("post", {
                    postTitle: qPost.title,
                    postBody: qPost.body
                });
            }
        }
    });
});

app.post("/compose", (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody
    });
    post.save((err) => {
        err ? console.log(err) : res.redirect("/");
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});