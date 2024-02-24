const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
}, {timestamps: true});

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;