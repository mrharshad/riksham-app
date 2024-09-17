import jwt from "jsonwebtoken";
import dbConnect from "@/backend/config/dbConnect";
import errors from "@/backend/utils/errorHandler";
import user from "@/backend/models/user";
import client from "@/backend/config/redisConnect";

// apply pages -/ header
export async function POST(req) {
  try {
    let { token, newSearchKeys } = await req.json();
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)?._id;

    dbConnect();

    newSearchKeys = Array.isArray(newSearchKeys)
      ? newSearchKeys.slice(0, 10)
      : [];
    newSearchKeys = newSearchKeys.map((data) => JSON.stringify(data));
    const update = await user.findByIdAndUpdate(
      { _id },
      { $set: { searchKeys: newSearchKeys } }
      //   { new: true } //- isse nucomment krne par bhi mobgodb updated doc return krta hai
    );
    update.searchKeys = newSearchKeys;
    //   await client.hset(`user:${_id}`, update);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return errors(error, 200);
  }
}
