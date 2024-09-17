import dbConnect from "@/backend/config/dbConnect";
import client from "@/backend/config/redisConnect";
import User from "@/backend/models/user";
import errors from "@/backend/utils/errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// apply - api/product?k
export async function PUT(req) {
  try {
    const obj = await req.json();
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    dbConnect();
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)._id;

    let findUser;
    // try {
    // findUser = await client.hget(`user:${_id}`, "cartPro");
    // } catch (err) {}
    if (!findUser) {
      findUser = await User.findById(_id, { cartPro: 1 });
    }

    function success() {
      return new Response(
        JSON.stringify({
          success: true,
          obj,
        }),
        {
          status: 200,
        }
      );
    }

    if (!findUser) {
      throw new Error("user not found");
    }

    const { cartPro } = findUser;

    const findProduct = cartPro.some((cart) => cart._id === obj._id);
    if (findProduct) {
      return success();
    }
    if (cartPro.length === 9) {
      throw new Error("Cannot add more than 9 products to cart");
    }

    const update = await findUser.updateOne({
      $push: {
        cartPro: obj,
      },
    });
    if (update.acknowledged && update.modifiedCount === 1) {
      // try {
      // cartPro.push(obj)
      //  await client.hset(`user:${_id}`, "cartPro", obj);
      // } catch (err) {
      //   cookies().delete(process.env.COOKIE_TOKEN_NAME);
      //   throw new Error("reload");
      // }
      return success();
    } else {
      throw new Error("Server Error");
    }
  } catch (error) {
    return errors(error, 200);
  }
}
