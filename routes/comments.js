var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment 
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    // connect new comment to particular campground 
                    campground.save();
                    console.log(comment);
                    req.flash("success ", "Successfully added comment");
                    // redirect campground show page 
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComments){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComments});
        }
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // findByIdAndUpdate - takes 3 things - (id, data, callback) 
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // findByIdAndRemove takes only 2 things - id of what is being removed, and callback 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;