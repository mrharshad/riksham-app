import client from "@/backend/config/redisConnect";
import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
// apply api ka use -    /single-p

export async function GET(req, context) {
  try {
    const _id = context.params._id;

    let data;
    // try {
    //   data = await client.hgetall(`single-p:${_id}`);
    // } catch (err) {}
    if (!data) {
      dbConnect();
      data = await Products.findById(_id, {
        varOpt: 0,
        buyers: { $slice: [0, 30] },
      });
      // try {
      //   await client.hset(`single-p:${_id}`, data);
      //   await client.expire(`single-p:${_id}`, 86400); //86400
      // } catch (err) {}
    } else {
      data = data._doc;
    }

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
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
