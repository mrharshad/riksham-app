import User from "@/backend/models/user";
import dbConnect from "@/backend/config/dbConnect";
import jwt from "jsonwebtoken";
import errors from "@/backend/utils/errorHandler";
import { cookies } from "next/headers";
// api apply - api/admin/user/product/cart
export async function GET(req) {
  try {
    let { searchParams } = new URL(req.url);
    const pId = searchParams.get("_id");
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_CODE);
    dbConnect();
    const newCartPro = await User.findByIdAndUpdate(
      _id,
      { $pull: { cartPro: { _id: pId } } },
      { new: true }
    ).select("cartPro");
    if (newCartPro) {
      // try {
      //  await client.hset(`user:${_id}`, "cartPro", newCartPro.cartPro);
      // } catch (err) {
      //   cookies().delete(process.env.COOKIE_TOKEN_NAME);
      //   throw new Error("reload");
      // }
      return new Response(
        JSON.stringify({
          success: true,
          message: "Product removed from cart",
          _id: pId,
        }),
        {
          status: 200,
        }
      );
    } else {
      throw new Error("Product not removed from cart");
    }
  } catch (err) {
    return errors(err, 200);
  }
}
