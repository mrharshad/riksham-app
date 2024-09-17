import dbConnect from "@/backend/config/dbConnect";
import NewOrders from "@/backend/models/NewOrders";
import User from "@/backend/models/user";
import errors from "@/backend/utils/errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// api apply - /admin/user/product/order
export async function PUT(req) {
  try {
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    let { reason, id, item } = await req.json();
    reason = reason.replace(/\s+/g, " ").trim();
    const reaLength = reason.length;
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)?._id;
    if (reaLength > 100)
      throw new Error("Reason must not exceed 100 characters");
    if (reaLength > 100) throw new Error("Order cancellation failed");

    dbConnect();
    const findOrder = await User.findOne(
      { _id, "canceled._id": item },
      { _id: 1 }
    );
    const orders = await NewOrders.findById(id);
    if (!orders) throw new Error("Order Not Found");
    const { items } = orders;
    const numOfItem = items.length;
    const findItem = items.find((obj) => obj._id == item);
    if (!findItem) throw new Error("Order Not Found");
    const status = findItem.status;

    findItem.time = reason;
    findItem.status = undefined;
    findItem.statusUP = Date.now();

    const res = (success, message) => {
      orders.items = items.filter((obj) => obj._id != item);
      return new Response(
        JSON.stringify({
          success,
          message,
          order: numOfItem > 1 ? orders : false,
        }),
        {
          status: 200,
        }
      );
    };
    const setValue =
      status == "Pending" || status == "Confirm"
        ? {}
        : {
            "issues.pod": "Not eligible for Pay on Delivery service",
          };

    if (findOrder) {
      const updateDoc = await User.updateOne(
        { _id, "canceled._id": id },

        {
          $set: setValue,
          $push: { "canceled.$.items": { $each: [findItem], $position: 0 } },
        }
      );
      if (updateDoc.modifiedCount !== 1)
        throw new Error("Order could not be canceled");
    } else {
      orders.items = [findItem];
      const updateDoc = await User.updateOne(
        { _id },

        {
          // $inc: { nOfNOrder: -qty },
          $set: setValue,
          $push: {
            canceled: {
              $each: [orders],
              $position: 0,
            },
          },
        }
      );
      if (updateDoc.modifiedCount !== 1)
        throw new Error("Order could not be canceled");
    }
    if (numOfItem > 1) {
      const removeItem = await NewOrders.updateOne(
        { _id: id },
        { $pull: { items: { _id: item } } }
      );
      if (removeItem.modifiedCount !== 1)
        return res(true, "Order could not be canceled");
    } else {
      const deleteOrder = await NewOrders.deleteOne({ _id: id });
      if (deleteOrder.deletedCount !== 1)
        return res(true, "Order could not be canceled");
    }
    return res(true, "Order canceled successfully");
  } catch (error) {
    return errors(error, 200);
  }
}
