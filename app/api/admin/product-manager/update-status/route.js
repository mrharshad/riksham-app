import dbConnect from "@/backend/config/dbConnect";
import NewOrders from "@/backend/models/NewOrders";
import errors from "@/backend/utils/errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
//   api apply - admin/product-manage/order-receiver-cancel

export async function PUT(req) {
  try {
    dbConnect();
    const { orderId, newStatus } = await req.json();
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const managerId = jwt.verify(token, process.env.JWT_SECRET_CODE)._id;

    const stateDistrict = {
      1: ["Chhattisgarh", "Raipur"],
    };
    const findManager = stateDistrict[managerId];
    if (!findManager)
      throw new Error(
        "Only Product Manager can change the status of the order"
      );

    const statuses = ["Confirm", "Dispatch", "Out for Delivery"];
    if (!statuses.includes(newStatus)) throw new Error("Wrong  new Status");

    const [_id, proId] = orderId.split("-");
    const updateStatus = await NewOrders.updateOne(
      {
        _id,
        "items._id": proId,
      },
      {
        $set: {
          "items.$.status": newStatus,
          "items.$.statusUP": Date.now(),
        },
      }
    );
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });
    if (updateStatus.modifiedCount === 1) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order status successfully updated",
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Status could not be updated",
        }),
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    return errors(err, 200);
  }
}
