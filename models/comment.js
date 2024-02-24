const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
  text: {type: String, required: true},
  postedAt : {type: Date, required: true}
}, {timestamps: true});

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;