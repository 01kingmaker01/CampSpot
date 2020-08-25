var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      'https://duckduckgo.com/?q=default%3A%27https%3A%2F%2Fimages.unsplash.com%2Fphoto-1573101573565-031197438e57%3Fixlib%3Drb-1.2.1%26ixid%3DeyJhcHBfaWQiOjEyMDd9%26auto%3Dformat%26fit%3Dcrop%26w%3D1050%26q%3D80%27%2C&ia=web',
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
