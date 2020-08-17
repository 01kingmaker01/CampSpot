const mongoose = require('mongoose');

//Declaring Schema
var commentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  date: { type: Date, default: Date.now },
  text: String,
});

//Declaring model
module.exports = mongoose.model('comment', commentSchema);
