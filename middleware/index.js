var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all of the middleware goes here 
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "campground not found"); 
                res.redirect("back");
            } else {
                // does user own the campground?
                // if(campground.author.id === req.user._id); *****THIS DOESNT WORK BECASUE ONE IS A STRING AND OTHER IS A MONGOOSE OBJECT*****
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
                console.log(err);
            } else {
                // does the user own the comment? 
                if(foundComment.author.id.equals(req.user._id)){
                    //author id is store in req.user._id thanks to PASSPORT!
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }    
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;