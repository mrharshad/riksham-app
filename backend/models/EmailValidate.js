import mongoose from "mongoose";
// const validator = require("validator");
const EmailValidate = new mongoose.Schema({
  _id: String,
  token: String,
  hold: Date,
  tokensSent: Number,
});

export default mongoose.models.EmailValidate ||
  mongoose.model("EmailValidate", EmailValidate);
