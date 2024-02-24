const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userRelationSchema = new Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
followedBack: { type: Boolean, required: true },
}, {timestamps: true});
const UserRelation = mongoose.model('UserRelation', userRelationSchema);
module.exports = UserRelation;