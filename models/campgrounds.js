const mongoose = require('mongoose');

//Declaring Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
});

const Comment = require('./comments');
campgroundSchema.pre('remove', async () => {
  await Comment.remove({
    _id: {
      $in: this.comments,
    },
  });
});

//Declaring model
module.exports = mongoose.model('campground', campgroundSchema);
