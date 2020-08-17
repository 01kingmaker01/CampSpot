const express = require('express');
var router = express.Router();
var campgrounds = require('../models/campgrounds');
var middleware = require('../middleware');

//Index route
router.get('/', (req, res) => {
  campgrounds.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campground/campgrounds', {
        campgrounds: allCampgrounds,
        page: 'campgrounds',
      });
    }
  });
});

//New route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campground/new', { page: 'newCampground' });
});

//Create route
router.post('/', middleware.isLoggedIn, (req, res) => {
  //gets name & imgUrl from new
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;

  //new campground
  var author = { id: req.user._id, username: req.user.username };

  var newCampground = {
    name: name,
    img: image,
    price: price,
    description: description,
    author: author,
  };
  campgrounds.create(newCampground, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/campgrounds');
});

//show route -- shows more info about items in index route
router.get('/:id', (req, res) => {
  //capture id
  campgrounds
    .findById(req.params.id)
    .populate('comments')
    .exec(function (err, campInfo) {
      if (err || !campInfo) {
        console.log(err);
        req.flash('error', 'Sorry, that campground does not exist!');
        res.redirect('/campgrounds');
      } else {
        res.render('campground/show', { campInfo: campInfo });
      }
    });
});

//show route -- shows more info about items in index route
router.get('/c/:id', (req, res) => {
  //capture id
  campgrounds
    .findById(req.params.id)
    .populate('comments')
    .exec(function (err, campInfo) {
      if (err || !campInfo) {
        console.log(err);
        req.flash('error', 'Sorry, that campground does not exist!');
        res.redirect('/campgrounds');
      } else {
        res.render('campground/showC', { campInfo: campInfo });
      }
    });
});

//edit
router.get('/:id/edit', middleware.checkCampOwn, (req, res) => {
  campgrounds.findById(req.params.id, (err, foundCampground) => {
    res.render('campground/edit', { campground: foundCampground });
  });
});

//update
router.put('/:id', middleware.checkCampOwn, (req, res) => {
  campgrounds.findByIdAndUpdate(req.params.id, req.body, (err, updatedCamp) => {
    res.redirect('/campgrounds/' + req.params.id);
  });
});

//delete
router.delete('/:id', middleware.checkCampOwn, async (req, res) => {
  try {
    let foundCampground = await campgrounds.findById(req.params.id);
    await foundCampground.deleteOne();
    res.redirect('/campgrounds');
  } catch (error) {
    console.log(error.message);
    req.flash('success', 'Campground Deleted');
    res.redirect('/campgrounds');
  }

  // campgrounds.findOneAndDelete(req.params.id, (err) => {
  //   res.redirect('/campgrounds');
  // });
});

module.exports = router;
