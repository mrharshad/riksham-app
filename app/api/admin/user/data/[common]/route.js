import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import { verify } from "jsonwebtoken";
import client from "@/backend/config/redisConnect";
import errors from "@/backend/utils/errorHandler";
export async function GET(req, context) {
  try {
    const { _id } = verify(context.params.common, process.env.JWT_SECRET_CODE);
    let data;

    try {
      if (process.env.REDIS_USERS_CACHE)
        data = await client.hGetAll(`user:${_id}`);
    } catch (err) {}
    if (!data) {
      dbConnect();
      data = await User.findById(_id, {
        canceled: 0,
        delivered: 0,
      }).select("+password");
      if (!data) {
        throw new Error("user not found");
      }
      if (process.env.REDIS_USERS_CACHE)
        try {
          await client.hSet(`user:${_id}`, {
            date: Date.now(),
            second: JSON.stringify({
              third: "this is third",
              four: ["this is four 1", "this is four 2"],
            }),
            third: JSON.stringify(["this", "is", "third", "value"]),
          });
          await client.expire(`user:${_id}`, 115); //86400
        } catch (err) {}
    } else {
      // data = data._doc;
    }

    delete data.password;
    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return errors(req, 200);
  }
}
