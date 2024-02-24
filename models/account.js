const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number },
  birthDate: { type: Date },
  avatar: { type: String },
  creationDate: {type : Date, required: true},
  bio: { type: String },
  nbOfFollowers: { type: Number, required: true },
  nbOfFollowings: { type: Number, required: true },
}, {timestamps: true});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;