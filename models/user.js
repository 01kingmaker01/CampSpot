var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1054&q=80',
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
var options = {
  errorMessages: {
    IncorrectPasswordError: 'Password is incorrect',
    IncorrectUsernameError: 'Username is incorrect',
  },
};

UserSchema.plugin(passportLocalMongoose, options);
module.exports = mongoose.model('User', UserSchema);
