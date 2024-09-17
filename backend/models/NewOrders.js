import mongoose from "mongoose";
const newOrder = new mongoose.Schema({
  _id: Number,
  userId: Number,
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
      status: String,
      time: String,
      variantD: String,
    },
  ],
});

export default mongoose.models.NewOrder || mongoose.model("NewOrder", newOrder);
