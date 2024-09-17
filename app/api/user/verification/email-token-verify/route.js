import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import errors from "@/backend/utils/errorHandler";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
export async function POST(req) {
  const { userType, password, firstStep } = await req.json();
  const docId = { _id: "additionalInfo" };
  let {
    fName,
    lName,
    address,
    email,
    district,
    tokensSent,
    tokenExpire,
    token,
    state,
    pinCode,
    mobileNo,
    verificationFailed,
    holdOnVerification,
    birth,
    gender,
  } = firstStep;

  try {
    holdOnVerification = new Date(holdOnVerification);
    verificationFailed = verificationFailed || 0;
    const age = new Date().getFullYear() - new Date(birth).getFullYear();

    if (holdOnVerification > Date.now()) {
      const pendingTime = ((holdOnVerification - Date.now()) / 60 / 60 / 1000)
        .toFixed(2)
        .toString();
      const [hours, minute] = pendingTime.split(".");
      throw new Error(
        `try after: ${
          pendingTime.length > 2
            ? `${hours}:hours ${minute}:minutes`
            : `${minute}: minutes`
        }`
      );
    }
    if (tokenExpire < Date.now()) {
      throw new Error(`token expired`);
    }
    const { verifiedEmail, token: userToken } = Jwt.verify(
      token,
      process.env.JWT_SECRET_CODE
    );
    if (
      userToken !== userType.trim() ||
      mobileNo.trim().length !== 10 ||
      pinCode.trim().length !== 6 ||
      age < 4 ||
      age > 80 ||
      !age
    ) {
      throw new Error("information  is incorrect");
    }

    function capitalizeWords(str) {
      return str.replace(/\b\w/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
    fName = capitalizeWords(fName.toLowerCase().trim());
    lName = capitalizeWords(lName.toLowerCase().trim());
    address = capitalizeWords(address.toLowerCase().trim());
    district = capitalizeWords(district.toLowerCase().trim());
    state = capitalizeWords(state.toLowerCase().trim());
    gender = capitalizeWords(gender.toLowerCase().trim());

    const hashedPassword = await bcrypt.hash(password, 10);
    const dateFormatter = new Intl.DateTimeFormat("en-In", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dbConnect();
    const findLastId = await AdditionalInfo.findByIdAndUpdate(
      docId,
      {
        $inc: { lastUserId: 1 },
      },
      {
        projection: {
          lastUserId: 1,
        },
      }
    );

    if (!findLastId) {
      throw new Error("last id not fetching");
    }
    try {
      findLastId.lastUserId += 1;
      const [bYear, bMonth, bDate] = birth.split("-");

      const createData = await User.create({
        _id: findLastId.lastUserId,
        fName,
        lName,
        password: hashedPassword,
        email: verifiedEmail,
        mobileNo,
        address,
        state,
        district,
        pinCode,
        role: "User",
        bDate,
        bMonth,
        bYear,
        gender,
        createdAt: dateFormatter.format(new Date()),
      });
      const jwtToken = Jwt.sign(
        {
          _id: createData._id,
          role: ["User"],
        },
        process.env.JWT_SECRET_CODE,
        {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        }
      );
      cookies().set({
        name: process.env.COOKIE_TOKEN_NAME,
        value: jwtToken,
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        path: "/", // all path
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "email verification successful",
        }),
        {
          status: 201,
        }
      );
    } catch (err) {
      await AdditionalInfo.updateOne(docId, {
        $inc: { lastUserId: -1 },
      });
      throw new Error(err.message);
    }
  } catch (error) {
    if (!error.message.includes("try after")) {
      firstStep.verificationFailed = verificationFailed + 1;
    }
    if (verificationFailed >= 5) {
      firstStep.holdOnVerification = new Date(Date.now() + 24 * 60 * 60 * 1000);
      firstStep.verificationFailed = 0;
    }
    cookies().set({
      name: "newAccount",
      value: JSON.stringify(firstStep),
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
    });
    return errors(error, 200);
  }
}
