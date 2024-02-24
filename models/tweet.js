const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tweetSchema = new Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  content: { type: String, required: true },
  nbOfLikes: { type: Number, required: true },
  nbOfComments: { type: Number, Required: true },
  postedAt: { type: Date, required: true },
}, {timestamps: true});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;