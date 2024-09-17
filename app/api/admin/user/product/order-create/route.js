import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
import errors from "@/backend/utils/errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import NewOrders from "@/backend/models/NewOrders";
// api apply - /admin/user/product/buy
export async function PUT(req) {
  try {
    const docId = { _id: "additionalInfo" };
    const { userCartPro, ...location } = await req.json();
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const _id = jwt.verify(token, process.env.JWT_SECRET_CODE)?._id;
    dbConnect();
    let data;
    if (!data) {
      dbConnect();
      data = await User.findOne(
        { _id },
        { cartPro: 1, issues: 1, fName: 1, lName: 1 }
      );
    }
    if (!data) {
      throw new Error("user not found");
    }

    let { issues = {}, cartPro, fName, lName } = data;
    if (issues.pod) throw new Error(issues.pod);
    let newOrder;
    const outOfStocks = [];
    let items = userCartPro.flatMap((obj) => {
      const {
        qty,
        _id,
        maxDay,
        thumbnail,
        name,
        tOfP,
        iSN,
        vD,
        discount,
        variantD,
        imageSetD,
        mrp,
      } = obj;
      if (qty) {
        return {
          _id,
          image: thumbnail,
          name,
          tOfP,
          iSN,
          vD,
          qty,
          variantD,
          imageSetD,
          status: "Pending",
          time: maxDay,
          current: (mrp - mrp * (discount.dis / 100)).toFixed(),
          statusUP: Date.now(),
        };
      } else {
        outOfStocks.push(_id);
        return [];
      }
    });

    cartPro = cartPro.filter((obj) => outOfStocks.includes(obj._id));

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
    // throw new Error("testing");
    const pod =
      "Use a payment option other than Pay on Delivery to place an order";
    try {
      newOrder = await NewOrders.create({
        _id: findLastId.lastOrderId + 1,
        userId: _id,
        uName: `${fName} ${lName}`,
        ...location,
        items,
        tofPay: "Pay on Delivery",
        createdAt: Date.now(),
      });
      if (newOrder) {
        const setNumOfOrder = await User.updateOne(
          { _id },
          {
            $set: {
              cartPro,
            },
          }
        );
        if (setNumOfOrder.acknowledged && setNumOfOrder.modifiedCount === 1) {
        } else throw new Error("Order could not be received");
      } else throw new Error("Order could not be received");
    } catch (error) {
      await AdditionalInfo.updateOne(docId, {
        $inc: { lastOrderId: -1 },
      });
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order has been successfully received",
        newOrder,
        cartPro,
        numOfCartP: cartPro.length,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return errors(error, 200);
  }
}
