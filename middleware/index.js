const campgrounds = require('../models/campgrounds');
const comments = require('../models/comments');

var middleware = {};
middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be LogIn');
  res.redirect('/users');
};

middleware.checkCampOwn = function (req, res, next) {
  //is user logged in
  if (req.isAuthenticated()) {
    campgrounds.findById(req.params.id, (err, foundCamp) => {
      if (err || !foundCamp) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        //does user own this campground?
        //       foundCamp.author.id is Mongoose Object
        //       req.user._id is String ... SO BOTH ARE DIFFERENT.....so use  .equals()

        if (
          (req.user && foundCamp.author.id.equals(req.user._id)) ||
          req.user.isAdmin
        ) {
          next();
        } else {
          req.flash('error', 'Access denied!!!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be LogIn');
    res.redirect('/users');
  }
};

middleware.commentOwn = function (req, res, next) {
  //is logged in
  if (req.isAuthenticated) {
    comments.findById(req.params.cid, (err, foundComm) => {
      if (err || !foundComm) {
        req.flash('error', 'Comment NOT found');
        console.log(err);
        res.redirect(`/campgrounds/${req.params.id}`);
      } else {
        //doesit belongs to him
        if (
          (req.user && foundComm.author.id.equals(req.user._id)) ||
          req.user.isAdmin
        ) {
          next();
        } else {
          req.flash('error', 'Access denied!!!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be LogIn');
    res.redirect('/users');
  }
};

module.exports = middleware;
