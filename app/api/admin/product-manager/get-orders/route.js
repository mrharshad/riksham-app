import dbConnect from "@/backend/config/dbConnect";
import NewOrders from "@/backend/models/NewOrders";
import User from "@/backend/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
//   api apply - admin/product-manager/orders-received-cancel

export async function PUT(req) {
  try {
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME).value;
    let { status, page } = await req.json();

    const limit = 20;
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)._id;
    const stateDistrict = {
      1: ["Chhattisgarh", "Raipur"],
    };
    const [state, district] = stateDistrict[_id] || [];
    if (!district) {
      throw new Error(
        "Only Product Manager can change the status of the order"
      );
    }
    dbConnect();

    let orders;
    if (status == "neworder") {
      orders = await NewOrders.find({
        state,
        district,
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      orders = await User.aggregate([
        {
          $unwind: `$${status}`,
        },
        { $skip: limit * (page - 1) },
        { $limit: limit },
        {
          $project: {
            [status]: true,
          },
        },
        {
          $match: {
            $and: [
              { [`${status}.state`]: state },
              { [`${status}.district`]: district },
            ],
          },
        },
        {
          $sort: { [`${status}.statusUP`]: -1 },
        },
      ]);
    }
    return new Response(
      JSON.stringify({
        success: true,
        orders,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message,
      }),
      {
        status: 200,
      }
    );
  }
}
