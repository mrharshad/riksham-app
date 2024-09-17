import mongoose from "mongoose";

const AdditionalInfo = new mongoose.Schema({
  _id: String,
  lastProductId: Number,
  lastOrderId: Number,
  lastUserId: Number,
  nonDeletedImg: [{ _id: Date, nonDIPName: String, publicId: [] }],
  deletedProduct: [
    {
      _id: Number,
      name: String,
      mId: Number,
      deletedAt: { type: Date, default: Date.now() },
    },
  ],
  contactUs: [
    {
      cUsName: String,
      cUsEmail: String,
      cUsTopic: String,
      cUsMessage: String,
      cUsCreatedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

export default mongoose.models.AdditionalInfo ||
  mongoose.model("AdditionalInfo", AdditionalInfo);
