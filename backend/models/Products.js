import mongoose from "mongoose";
// const validator = require("validator");
const Product = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    brand: String,
    tOfP: String, // Men: Football Shoes / sabse pahale kiske liye hai agar sabhi ke liye hai to sirf Football Shoes
    category: String,
    des1: String,
    des2: String,
    des3: String,

    // description: String, // karna hai
    description: [String],

    // keyValueD: [String], delete krna hai
    keyValueD: [String],
    // exDesc: [String], aInfo ki jagha par exDesc name set krna hai key : value
    aInfo: [String],
    // imgSetDiff:string
    imageSetD: String,
    imgSetPD: Boolean, // iska koi kaam nhi haii
    thumbnail: { thumbId: String, thumbUrl: String },
    imageSets: [
      {
        _id: false,
        iSN: String,
        // update: Date,
        // images:[string]  // url|-|id
        images: [
          {
            _id: false,
            imgId: String,
            url: String,
          },
        ],
      },
    ],
    // varDiff:string
    variantD: String,
    variants: [
      {
        _id: false,
        vD: String, // variant diffrence
        diff: String,
        // purchased: Number, // options ki jagha par yaha par dena hai
        disOpt: [
          {
            _id: false,
            min: Number,
            dis: Number,
          },
        ], // agar 5 diye hai to user order karne ke liye 5 qty set karta hai to second discond apply hoga 10 karta hai to third vala
        options: [
          {
            _id: false,
            optID: String,
            // purchased  delete krna hai
            purchased: Number, // mere ko kitna perecent discount mill raha hai
            mrp: Number,
            loc: [
              {
                _id: false,
                s: String,
                d: [String],
              },
            ],
          },
        ],
      },
    ],
    certificate: [
      {
        _id: false,
        cN: String,
        cImages: [String],
      },
    ],
    // varKVD ko delete krna hai
    varKVD: {
      type: Object,
    }, // key variant ka naam aur value me object jisme key value me data hoga
    varOpt: [
      {
        _id: false,
        voName: String, // variant-option
        sellers: [],
        updates: [
          {
            _id: false,
            uTime: Date,
            uId: Number,
            uValues: {}, // old key value ko store krna hai
          },
        ],
      },
    ],
    popular: {
      type: Number,
      sparse: true,
    },

    rating: Number,
    sold: { type: Number, default: 0 },
    rInP: [Number],
    buyers: [
      {
        _id: Number,
        bN: String,
        bS: String,
        bD: String,
        bR: {
          type: Number,
          max: 5,
          min: 1,
        },
        bC: String,
        dDate: String,
      },
    ],
    createdAt: Date,
  }

  // { versionKey: false }
);

// Product.index(
//   // index create karne ke liye
//   {
//     name: 1,
//   },
//   { unique: true }
// );

export default mongoose.models.Product || mongoose.model("Product", Product);
