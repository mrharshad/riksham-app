import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import nodeMailer from "nodemailer";
import crypto from "crypto";
import client from "@/backend/config/redisConnect";
// apply api - /user/login
export async function PUT(req) {
  const response = (success, message, resReTryForget) =>
    new Response(
      JSON.stringify({
        success,
        message,
        resReTryForget,
      }),
      {
        status: 200,
      }
    );
  try {
    let { email } = await req.json();

    dbConnect();
    let [userName, domain] = email.trim().split("@");
    domain = domain.toLowerCase();
    if (domain !== "gmail.com") {
      throw new Error("Use username@gmail.com to sign up");
    }
    email = userName.concat("@", domain);
    let dataBase = "mongoDB";
    let findUser;
    try {
      findUser = await client.hgetall(`email:${email}`);
    } catch (err) {}
    if (findUser) dataBase = "redis";
    if (findUser && !findUser._id) throw new Error("Invalid email");
    if (!findUser) {
      findUser = await User.findOne(
        { email },
        { canceled: 0, delivered: 0 }
      ).select("+password");
      if (!findUser) {
        await client.hset(`email:${email}`, { email });
        await client.expire(`email:${email}`, 86400); //24hours
        throw new Error("Invalid email");
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
    let { reTryForgot, numOfForgot = 0 } = tokens;
    reTryForgot = reTryForgot ? new Date(reTryForgot) : undefined;
    if (reTryForgot && reTryForgot > Date.now()) {
      const pendingTime = (
        (reTryForgot - Date.now()) /
        (1000 * 60 * 60)
      ).toFixed(2);
      const [hours, minute] = pendingTime.split(".");
      if (dataBase == "mongoDB") {
        await client.hset(`email:${email}`, newDoc);
        await client.expire(`email:${email}`, 86400); //24hours
      }
      return response(false, `Try After: ${hours} : hours  `, reTryForgot);
    }

    if (numOfForgot === 3) {
      tokens.numOfForgot = 0;
      tokens.reTryForgot = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (reTryForgot) delete tokens.reTryForgot;
      findUser.tokens = tokens;
      try {
        await client.hset(`email:${email}`, newDoc);
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
      return response(false, `Try After 24 hours`, tokens.reTryForgot);
    }
    const protocol = new URL(req.url).protocol;
    const hostname = new URL(req.url).hostname;
    const randomString = crypto.randomBytes(20).toString("hex");
    const resetPasswordUrl = `${protocol}//${hostname}/user/password-recovery?key=${randomString}&email=${email}`;

    const message = `Hi ${fName}  \n\n We have received a request for password recovery on ${hostname} via your email address, You can choose your new password through this URL, \n\n ${resetPasswordUrl} \n\n This URL will become invalid after some time,\n\n  If you did not request this code, it is possible that someone else is trying to password recovery for ${hostname} Do not forward or give this code to anyone.\n\n You received this message because your @gmail address was used to password recovery on ${hostname}`;
    const transporter = nodeMailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const mailOption = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: `${hostname} password recovery`,
      text: message,
    };
    const sendMail = await transporter.sendMail(mailOption);

    if (sendMail.accepted.length > 0) {
      tokens.forgotExpire = new Date(Date.now() + 15 * 60 * 1000);
      tokens.numOfForgot = numOfForgot + 1;
      tokens.forgotToken = crypto
        .createHash("sha256")
        .update(randomString)
        .digest("hex");
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
      return response(true, `Email send:- ${email}`);
    } else {
      return response(
        false,
        "There was a problem sending token, please try again later"
      );
    }
  } catch (err) {
    return response(false, err.message);
  }
}
