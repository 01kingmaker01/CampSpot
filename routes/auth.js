const express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user');
const user = require('../models/user');

router.get('/landing', (req, res) => {
  res.render('landing');
});

router.get('/users', (req, res) => {
  res.render('welcome', { page: 'users' });
});

router.get('/', (req, res) => {
  res.render('campground/landingDemo', { page: '/' });
});

//register
router.get('/users/register', (req, res) => {
  res.render('register', { page: 'register' });
});

router.post('/users/register', (req, res) => {
  var { name, email, avatar, username, password, password0 } = req.body;

  if (password != password0) {
    req.flash('success', "Password Didn't matched");
    res.redirect('/users/register', {
      name,
      email,
      username,
      password,
      password0,
      avatar,
    });
  }

  User.findOne({ email: email }, (user) => {
    if (user) {
      req.flash('error', err.message);
      res.redirect('/users/register', {
        name,
        email,
        username,
        password,
        password0,
        avatar,
      });
    } else {
      User.findOne({ username: username }, (foundUser) => {
        if (foundUser) {
          req.flash('error', err.message);
          res.redirect('/users/register', {
            name,
            email,
            username,
            password,
            password0,
          });
        } else {
          var newUser = new User({
            username: req.body.username,
            name: name,
            email: email,
            avatar: avatar,
          });
          User.register(newUser, req.body.password, (err, user) => {
            if (err) {
              req.flash('error', err.message);
              console.log(err);
              res.redirect('/users/register', {
                name,
                email,
                username,
                password,
                password0,
                avatar,
              });
            }
            passport.authenticate('local')(req, res, () => {
              req.flash('success', `Logged in as ${req.user.username}`);
              res.redirect('/campgrounds');
            });
          });
        }
      });
    }
  });
});

//login template
router.get('/users/login', (req, res) => {
  res.render('login', { page: 'login' });
});

router.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/users/login',
    successFlash: true,

    successFlash: `Succesfully Logged In`,
    failureFlash: true,
  }),
  (req, res) => {
    console.log(currentUser);
  }
);

// logout
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged You Out');
  res.redirect('/users/login');
});

// ================================================================
// ================================================================

// ================================================================
// ================================================================

//ADMIN_REGISTER || == || == || == ||
router.get('/users/admin', (req, res) => {
  res.render('admin', { page: 'admin' });
});

router.post('/users/admin', (req, res) => {
  var { name, email, username, password, password0 } = req.body;

  if (password != password0) {
    req.flash('success', "Password Didn't matched");
    res.redirect('/users/admin', {
      name,
      email,
      username,
      password,
      password0,
    });
  }

  User.findOne({ email: email }, (user) => {
    if (user) {
      req.flash('error', err.message);
      res.redirect('/users/admin', {
        name,
        email,
        username,
        password,
        password0,
      });
    } else {
      User.findOne({ username: username }, (foundUser) => {
        if (foundUser) {
          req.flash('error', err.message);
          res.redirect('/users/admin', {
            name,
            email,
            username,
            password,
            password0,
          });
        } else {
          var newUser = new User({
            username: req.body.username,
            name: name,
            email: email,
          });
          if (req.body.secret === 'youAreAdmin69') {
            newUser.isAdmin = true;
          }
          User.register(newUser, req.body.password, (err, user) => {
            if (err) {
              req.flash('error', err.message);
              console.log(err);
              res.redirect('/users/admin', {
                name,
                email,
                username,
                password,
                password0,
              });
            }
            passport.authenticate('local')(req, res, () => {
              req.flash('success', `Logged in as ${req.user.username}`);
              res.redirect('/campgrounds');
            });
          });
        }
      });
    }
  });
});

router.get('/users/:pid', (req, res) => {
  user.findById(req.params.pid, (err, foundUser) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/campgrounds');
    } else {
      res.render('profile', { user: foundUser });
    }
  });
});

module.exports = router;
