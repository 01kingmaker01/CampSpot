const express = require('express');
var router = express.Router({ mergeParams: true });
var campgrounds = require('../models/campgrounds');
var comments = require('../models/comments');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, (req, res) => {
  campgrounds.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/landingDemo');
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  var newComment = req.body.comment;
  campgrounds.findById(req.params.id, (err, campground) => {
    if (err) {
      console.error(err);
    } else {
      comments.create(newComment, (err, comment) => {
        if (err) {
          console.error(err);
        } else {
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

//edit
router.get('/:cid/edit', middleware.commentOwn, (req, res) => {
  comments.findById(req.params.cid, (err, foundComment) => {
    res.render('comments/edit', {
      campID: req.params.id,
      comment: foundComment,
    });
  });
});

//update
router.put('/:cid/', middleware.commentOwn, (req, res) => {
  comments.findByIdAndUpdate(
    req.params.cid,
    req.body.comment,
    (err, updatedComment) => {
      res.redirect('/campgrounds/' + req.params.id);
    }
  );
});

//delete
router.delete('/:cid', middleware.commentOwn, (req, res) => {
  comments.findByIdAndDelete(req.params.cid, (err) => {
    res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;
