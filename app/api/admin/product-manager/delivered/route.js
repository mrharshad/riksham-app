import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Products from "@/backend/models/Products";
import NewOrders from "@/backend/models/NewOrders";
import errors from "@/backend/utils/errorHandler";
//   api apply - admin/product-manage/order-receiver-cancel
export async function PUT(req) {
  try {
    const { userId: _id, orderId, newStatus } = await req.json();
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const managerId = jwt.verify(token, process.env.JWT_SECRET_CODE)._id;

    const stateDistrict = {
      1: ["Chhattisgarh", "Raipur"],
    };

    if (!stateDistrict[managerId])
      throw new Error(
        "Only Product Manager can change the status of the order"
      );

    const [oId, proId] = orderId.split("-");
    const res = (success, message) =>
      new Response(
        JSON.stringify({
          success,
          message,
        }),
        {
          status: 200,
        }
      );
    dbConnect();
    const findOrder = await User.findOne(
      { _id, "delivered._id": oId },
      { _id: 1 }
    );
    const orders = await NewOrders.findById(oId);
    if (!orders) throw new Error("Order Not Found");
    const { items } = orders;
    orders.items = undefined;
    const item = items.find((obj) => obj._id == proId);
    if (!item) throw new Error("Order Not Found");

    item.time = undefined;
    item.status = undefined;
    item.statusUP = Date.now();
    const qty = +item.qty;
    if (findOrder) {
      const updateDoc = await User.updateOne(
        { _id, "delivered._id": oId },

        {
          $set: { "issues.pod": false },
          // $inc: { nOfNOrder: -qty },
          $push: { "delivered.$.items": { $each: [item], $position: 0 } },
        }
      );
      if (updateDoc.matchedCount !== 1)
        throw new Error("User Document Not Update");
    } else {
      orders.items = [item];
      const updateDoc = await User.updateOne(
        { _id },
        {
          // $inc: { nOfNOrder: -qty },
          $set: { "issues.pod": false },
          $push: {
            delivered: {
              $each: [orders],
              $position: 0,
            },
          },
        }
      );
      if (updateDoc.matchedCount !== 1)
        throw new Error("User Document Not Update");
    }
    if (items.length > 1) {
      const removeItem = await NewOrders.updateOne(
        { _id: oId },
        { $pull: { items: { _id: proId } } }
      );
      if (removeItem.matchedCount !== 1)
        return res(true, "Could not delete item from new order collection");
    } else {
      const deleteOrder = await NewOrders.deleteOne({ _id: oId });
      if (deleteOrder.deletedCount !== 1)
        return res(true, "New order could not be deleted");
    }

    const updateProduct = await Products.updateOne(
      { _id: proId },
      {
        $inc: { sold: qty },
      }
    );
    if (updateProduct.matchedCount !== 1)
      return res(
        true,
        "How much product was delivered could not be setuld not set buyer details in product document"
      );

    return res(true, "Order status successfully updated");
  } catch (err) {
    return errors(err, 200);
  }
}
