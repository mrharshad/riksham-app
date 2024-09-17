import jwt from "jsonwebtoken";
import dbConnect from "@/backend/config/dbConnect";
import errors from "@/backend/utils/errorHandler";
import user from "@/backend/models/user";
import client from "@/backend/config/redisConnect";

// apply pages -/ header
export async function POST(req) {
  try {
    let { token, newIntTofP, searchKeys } = await req.json();
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)?._id;

    dbConnect();
    newIntTofP = Array.isArray(newIntTofP) ? newIntTofP.slice(0, 10) : [];
    searchKeys = Array.isArray(searchKeys) ? searchKeys.slice(0, 10) : [];
    if (searchKeys.length > 0) {
      newIntTofP = newIntTofP.flatMap((data) => data.name);

      searchKeys = searchKeys.map((data) => JSON.stringify(data));
      const update = await user.findByIdAndUpdate(
        { _id },
        { $set: { intTofP: newIntTofP, searchKeys } }
        //   { new: true } //- isse nucomment krne par bhi mobgodb updated doc return krta hai
      );
      update.intTofP = newIntTofP;
      update.searchKeys = searchKeys;
      // await client.hset(`user:${_id}`, update);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return errors(error, 200);
  }
}
