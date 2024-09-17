import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import jwt from "jsonwebtoken";
import errors from "@/backend/utils/errorHandler";
import { cookies } from "next/headers";
export async function PUT(req) {
  try {
    const errorSend = (msg) => {
      throw new Error(msg);
    };
    const successRes = (data) => {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Your details have been successfully updated",
          data,
        }),
        {
          status: 200,
        }
      );
    };
    let { fName, lName, mobileNo, birth, gender, oldData } = await req.json();
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    mobileNo = typeof mobileNo === "string" ? mobileNo : new String(mobileNo);
    mobileNo = mobileNo.slice(-10);
    if (mobileNo.length != 10) {
      errorSend("check your mobile number");
    }
    const acceptable = "1234567890";
    for (let i of acceptable) {
      if (!acceptable.includes(i)) {
        errorSend("check your mobile number");
      }
    }

    const newData = JSON.stringify({ fName, lName, mobileNo, gender, birth });
    if (newData == oldData) {
      return successRes();
    }

    typeof mobileNo === "number" ? JSON.stringify(mobileNo) : mobileNo;

    if (mobileNo.length != 10) {
      throw new Error("information  is incorrect");
    }
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_CODE);
    function capitalizeWords(str) {
      return str.replace(/\b\w/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    fName = capitalizeWords(fName.toLowerCase().trim());
    lName = capitalizeWords(lName.toLowerCase().trim());
    gender = capitalizeWords(gender.toLowerCase().trim());
    mobileNo = Number(mobileNo);
    dbConnect();
    const [bYear, bMonth, bDate] = birth.split("-");
    const data = {
      fName,
      lName,
      gender,
      mobileNo,
      bYear,
      bMonth,
      bDate,
    };
    const updatedDoc = await User.findByIdAndUpdate(
      _id,
      {
        $set: data,
      },
      { new: true }
    );
    if (updatedDoc) {
      try {
        await client.hset(`user:${_id}`, updatedDoc);
      } catch (err) {}
      return successRes(data);
    } else {
      throw new Error("Your details could not be updated");
    }
  } catch (error) {
    return errors(error, 200);
  }
}
