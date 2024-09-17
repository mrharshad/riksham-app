import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import client from "@/backend/config/redisConnect";

// apply api - /user/password-recovery
export async function PUT(req) {
  try {
    const { password, key, email } = await req.json();
    dbConnect();
    const token = crypto.createHash("sha256").update(key).digest("hex");

    let findUser;
    let dataBase = "mongoDB";
    try {
      findUser = await client.hgetall(`email:${email}`);
    } catch (err) {}
    if (findUser) dataBase = "redis";
    if (findUser && !findUser._id)
      throw new Error("Invalid email and password");
    if (!findUser) {
      findUser = await User.findOne({ email }, { canceled: 0, delivered: 0 });
    }

    if (!findUser) throw new Error("token expired");
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
    } = findUser;
    if (
      tokens.forgotToken !== token ||
      new Date(tokens.forgotExpire) < Date.now()
    )
      throw new Error("token expired");

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
      issues,
      createdAt,
      intTofP,
      searchKeys,
      tokens,
      email,
      password: await bcrypt.hash(password, 10),
    };
    try {
      await client.hset(`user:${_id}`, newDoc);
      await client.expire(`user:${_id}`, 86400); //86400
    } catch (err) {}

    const jwtToken = Jwt.sign(
      {
        _id,
        role,
      },
      process.env.JWT_SECRET_CODE,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      }
    );
    delete tokens.reTryForgot;
    delete tokens.numOfForgot;
    delete tokens.reTryPass;
    delete tokens.numOfWrongPass;
    delete tokens.forgotToken;
    delete tokens.forgotExpire;

    const update = await User.updateOne(
      { _id },
      { $set: { password: newDoc.password, tokens } }
    );
    if (update.modifiedCount == 1) {
      if (dataBase == "redis") await client.del(`email:${email}`);
      cookies().set({
        name: process.env.COOKIE_TOKEN_NAME,
        value: jwtToken,
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        path: "/", // all path
      });
    } else throw new Error(`Password not update`);

    delete findUser.password;
    newDoc.numOfCartP = cartPro.length;
    return new Response(
      JSON.stringify({
        success: true,
        message: `Password update successfully`,
        data: newDoc,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 200,
      }
    );
  }
}
