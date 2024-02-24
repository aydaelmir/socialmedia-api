const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likeSchema = new Schema({
  userId: { type: Number, required: true },
  tweetId: { type: Number, required: true },
}, {timestamps: true});

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;