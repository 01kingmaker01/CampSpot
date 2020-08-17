var express = require('express'),
  app = express(),
  // expressLayouts = require('express-ejs-layouts'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  campgrounds = require('./models/campgrounds'),
  comments = require('./models/comments'),
  User = require('./models/user');

//routes
var campgroundRoute = require('./routes/campgrounds');
var commentRoute = require('./routes/comments');
var authRoute = require('./routes/auth');

const db = require('./config/keys').MongoURI;

mongoose.set('useFindAndModify', false);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Atlas connected');
  })
  .catch((err) => console.error(err));
// app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/svg'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//routes
app.use(authRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/comments', commentRoute);

app.get('*', function (req, res) {
  res.render('error');
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(process.env.PORT || 3000, () =>
  console.log('Server has STARTED!!!')
);
