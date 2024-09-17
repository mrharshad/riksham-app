import dbConnect from "@/backend/config/dbConnect";
import jwt from "jsonwebtoken";
import errors from "@/backend/utils/errorHandler";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
import User from "@/backend/models/user";

// apply pages -/admin/senior-product-manager/create-product-order
export async function PUT(req) {
  try {
    const docId = { _id: "additionalInfo" };
    const {
      token,
      userId,
      pId,
      qty,
      shipping,
      packaging,
      state,
      district,
      pinCode,
      mrp,
      current,
      address,
      image,
      tOfP,
      name,
      expectD,
      mNumber,
      vD,
      iD,
      tofPay,
    } = await req.json();
    const { _id, role } = jwt.verify(token, process.env.JWT_SECRET_CODE);
    if (!role.includes("Senior Product Manager")) {
      throw new Error("request not valid");
    } else {
      dbConnect();
    }
    const findLastId = await AdditionalInfo.findByIdAndUpdate(
      docId,
      {
        $inc: { lastOrderId: 1 },
      },
      {
        projection: {
          lastOrderId: 1,
        },
      }
    );
    if (!findLastId) {
      throw new Error("last id not fetching");
    }
    try {
      findLastId.lastOrderId += 1;
      const orderCreate = await User.updateOne(
        { _id: userId },
        {
          $push: {
            newOrder: {
              _id: findLastId.lastOrderId,
              pId,
              address,
              district,
              state,
              pinCode,
              mNumber,
              expectD,
              name,
              qty,
              image,
              current,
              tOfP,
              mrp,
              shipping: shipping || undefined,
              packaging: packaging || undefined,
              vD: vD || undefined,
              iD,
              tofPay,
              status: "confirm",
              createdAt: Date.now(),
            },
          },
        }
      );
      if (orderCreate.acknowledged && orderCreate.modifiedCount === 1) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Successfully Order Created !",
          }),
          {
            status: 200,
          }
        );
      } else {
        throw new Error("Order not created");
      }
    } catch (err) {
      await AdditionalInfo.updateOne(docId, {
        $inc: { lastOrderId: -1 },
      });

      throw new Error(err.message);
    }
  } catch (error) {
    return errors(req, 200);
  }
}
