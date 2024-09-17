import dbConnect from "@/backend/config/dbConnect";
import client from "@/backend/config/redisConnect";
import User from "@/backend/models/user";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// apply api - /user/login
export async function PUT(req) {
  try {
    const { email, password: userEnter } = await req.json();
    const response = (success, message, resReTryPass) =>
      new Response(
        JSON.stringify({
          success,
          message,
          resReTryPass,
        }),
        {
          status: 200,
        }
      );

    let dataBase = "mongoDB";
    dbConnect();
    let findUser;
    try {
      findUser = await client.hgetall(`email:${email}`);
    } catch (err) {}
    if (findUser) dataBase = "redis";
    if (findUser && !findUser._id)
      throw new Error("Invalid email and password");
    if (!findUser) {
      findUser = await User.findOne(
        { email },
        { canceled: 0, delivered: 0 }
      ).select("+password");
      if (!findUser) {
        await client.hset(`email:${email}`, { email });
        await client.expire(`email:${email}`, 86400); //24hours
        throw new Error("Invalid email and password");
      }
    }
    let {
      _id,
      fName,
      lName,
      mobileNo,
      role,
      location,
      cartPro,
      bYear,
      bMonth,
      bDate,
      gender,
      tokens = {},
      issues = {},
      createdAt,
      intTofP,
      searchKeys,
      password,
    } = findUser;
    const newDoc = {
      _id,
      fName,
      lName,
      mobileNo,
      role,
      location,
      cartPro,
      bYear,
      bMonth,
      bDate,
      gender,
      tokens,
      issues,
      createdAt,
      intTofP,
      searchKeys,
      email,
      password,
    };

    let { reTryPass, numOfWrongPass = 0 } = tokens;
    reTryPass = reTryPass ? new Date(reTryPass) : undefined;

    if (reTryPass && reTryPass > Date.now()) {
      const pendingTime = ((reTryPass - Date.now()) / (1000 * 60 * 60)).toFixed(
        2
      );
      const [hours, minute] = pendingTime.split(".");
      if (dataBase == "mongoDB") {
        await client.hset(`email:${email}`, newDoc);
        await client.expire(`email:${email}`, 86400); //24hours
      }
      return response(false, `Try After: ${hours} : hours  `, reTryPass);
    }
    const verification = await bcrypt.compare(userEnter, password);
    if (verification) {
      delete tokens.reTryForgot;
      delete tokens.numOfForgot;
      delete tokens.reTryPass;
      delete tokens.numOfWrongPass;
      delete tokens.forgotToken;
      delete tokens.forgotExpire;
      await User.updateOne({ _id }, { $set: { tokens } });
      const createJwtToken = Jwt.sign(
        {
          _id,
          role,
        },
        process.env.JWT_SECRET_CODE,
        {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        }
      );
      if (dataBase == "redis") await client.del(`email:${email}`);
      cookies().set({
        name: process.env.COOKIE_TOKEN_NAME,
        value: createJwtToken,
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ), // 2023-06-28T08:19:14.768Z  iss prakar ka data leta hai
        httpOnly: true,
        path: "/", // all path
      });
      newDoc.numOfCartP = cartPro.length;
      newDoc.token = createJwtToken;
      try {
        await client.hset(`user:${_id}`, newDoc);
        await client.expire(`user:${_id}`, 86400); //86400
      } catch (err) {}
      delete newDoc.password;
      return response(true, "login successful", newDoc);
    } else {
      if (numOfWrongPass === 3) {
        tokens.numOfWrongPass = 0;
        tokens.reTryPass = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else {
        tokens.numOfWrongPass = numOfWrongPass + 1;
        if (reTryPass) delete tokens.reTryPass;
      }
      newDoc.tokens = tokens;

      try {
        await client.hset(`email:${email}`, newDoc);
        if (dataBase == "mongoDB") await client.expire(`email:${email}`, 86400); //24hours
      } catch (err) {
        await User.updateOne(
          { _id },
          {
            $set: {
              tokens,
            },
          }
        );
      }

      if (tokens.reTryPass)
        return response(false, `try after 24 hours`, tokens.reTryPass);
      else return response(false, "invalid email and password");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
