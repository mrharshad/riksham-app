import jwt from "jsonwebtoken";
import dbConnect from "@/backend/config/dbConnect";
import errors from "@/backend/utils/errorHandler";
import Products from "@/backend/models/Products";
import { cookies } from "next/headers";
import User from "@/backend/models/user";

// apply pages -/admin/user/product/order
export async function PUT(req) {
  try {
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    let { id, item, newRating, comment } = await req.json();
    newRating = Number(newRating);
    comment = comment.replace(/\s+/g, " ").trim();
    const numOfCar = comment.length;
    if (numOfCar > 300) throw new Error("Must not exceed 300 characters");
    if (numOfCar < 20) throw new Error("Write some more comments");

    const userId = jwt.verify(token, process.env.JWT_SECRET_CODE)?._id;
    dbConnect();

    const { fName, lName, location } =
      (await User.findOne(
        {
          _id: userId,
          "delivered._id": id,
          "delivered.items._id": item,
        },
        { "delivered.$": 1, fName: 1, lName: 1, location: 1 }
      )) || {};
    if (!fName) {
      throw new Error("The product has not been delivered to you");
    }
    const findProduct = await Products.findById(item, { buyers: 1 });
    if (!findProduct) {
      throw new Error("Product Not found");
    }

    let buyers = findProduct.buyers;

    let isBuyer;
    const dateFormatter = new Intl.DateTimeFormat("en-In", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let numOfRating = newRating;
    const stars = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    buyers.forEach(({ _id, bR }, index) => {
      if (_id == userId) {
        isBuyer = { index, bR };
      }
      numOfRating = numOfRating + bR;
      stars[bR] = stars[bR] + 1;
    });

    if (isBuyer) {
      const { index, bR } = isBuyer;
      numOfRating = numOfRating - bR;
      stars[bR] = stars[bR] - 1;
      buyers[index].bC = comment;
      buyers[index].bR = newRating;
    } else {
      const { state, district } = location[0];
      buyers.unshift({
        _id: userId,
        bN: `${fName} ${lName}`,
        bD: district,
        bS: state,
        bR: newRating,
        bC: comment,
        dDate: dateFormatter.format(Date.now()),
      });
    }

    stars[newRating] = stars[newRating] + 1;
    const totalReviews = buyers.length;
    const percentageRatings = [];
    for (const [bR, count] of Object.entries(stars)) {
      const percentage = (count / totalReviews) * 100;
      percentageRatings.push(Number(percentage.toFixed()));
    }

    const update = await Products.updateOne(
      { _id: item },
      {
        $set: {
          rInP: percentageRatings,
          buyers,
          rating: (numOfRating / totalReviews).toFixed(1),
        },
      }
    );
    if (update.modifiedCount == 1)
      return new Response(
        JSON.stringify({
          success: true,
          message: isBuyer
            ? "Your review has been updated"
            : "This review of yours will help the customer to choose the product",
        }),
        {
          status: 200,
        }
      );
    else throw new Error("Create review failed");
  } catch (error) {
    return errors(error, 200);
  }
}
