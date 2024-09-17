import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
const dataStructure = {
  _id: Number,
  uName: String,
  address: String,
  area: String,
  pinCode: Number,
  district: String,
  state: String,
  tofPay: {
    type: String,
    enum: [
      "Pay on Delivery",
      "Credit Card",
      "Debit Card",
      "Net Banking",
      "PayPal",
      "Google Pay",
      "UPI",
    ],
  },
  exInfo: {
    openBox: Boolean,
    oneTime: Boolean,
    gitPack: String,
  },
  payId: String,
  createdAt: Date,
  items: [
    {
      _id: Number,
      name: String,
      tOfP: String,
      image: String,
      iSN: String,
      imageSetD: String,
      vD: String,
      current: Number,
      statusUP: Date,
      qty: Number,
      time: String, // canceled hone ka resion hoga aur delivered hone par delete
      variantD: String,
    },
  ],
};
const User = new mongoose.Schema(
  {
    _id: Number,
    fName: String,
    lName: String,
    email: String,
    password: String,
    mobileNo: Number,
    role: [String],

    // "User"
    // "Product deil , Set Qty, and Price  Manager" => S D_&_P  M
    // "Product District Stock and Order Manager"  => P D S_&_O
    // "Product information Create, read, update" => => p-general

    location: [
      {
        _id: Date,
        address: String,
        pinCode: Number,
        state: String,
        district: String,
        area: String,
      },
    ],

    cartPro: [
      {
        _id: Number,
        vD: String,
        iSN: String,
      },
    ],

    gender: String,
    bDate: Number,
    bMonth: Number,
    bYear: Number,
    canceled: [dataStructure],
    delivered: [dataStructure],
    searchKeys: [String],
    intTofP: [String],
    nOfNOrder: Number,
    // default: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    tokens: {},
    issues: {},
    // token: String,
    // tokenExpire: Date,
    // verificationFailed: Number,
    // tokensSent: Number,
    // holdOnToken: Date,
    // holdOnVerification: Date,
    createdAt: Date,
  }
  // { versionKey: false }
);

// _________________________________________
// forgot password
// User.methods.resetPassword = function () {
//   const randomString = crypto.randomBytes(20).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(randomString)
//     .digest("hex");
//   this.restPasswordExpire = Date.now() + 15 * 60 * 1000;
//   return randomString;
// };
// ___________________________________________

// agar models me user collection pahale se hai to hum uska use karege anyatha new collection create karege

export default mongoose.models.User || mongoose.model("User", User);
