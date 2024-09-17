import nodeMailer from "nodemailer";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import errors from "@/backend/utils/errorHandler";

// apply api - /user/verification/email
export async function POST(req) {
  try {
    const hostname = new URL(req.url).hostname;
    const { firstStep } = await req.json();
    let { tokensSent, holdOnToken, fName, token } = firstStep;

    const verifiedEmail = Jwt.verify(
      token,
      process.env.JWT_SECRET_CODE
    )?.verifiedEmail;
    holdOnToken = new Date(holdOnToken);
    const characters =
      "ABCstuDE67FGHIJKOPQRSTUVWXabcdefghijklmnopqrvwxyzYZ0123458LM9N";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    const newToken = Jwt.sign(
      { token: randomString, verifiedEmail },
      process.env.JWT_SECRET_CODE,
      {
        expiresIn: "24h",
      }
    );

    const transporter = nodeMailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const message = `Hi ${fName} \n\n We have received a request to sign up on ${hostname} via your email address. Your ${hostname} verification code is: \n\n ${randomString} \n\n If you did not request this code, it is possible that someone else is trying to sign up for ${hostname}. Do not forward or give this code to anyone. \n\n You received this message because your @gmail address was used to sign up on ${hostname}.`;
    const mailOption = {
      from: process.env.SMTP_MAIL,
      to: verifiedEmail,
      subject: `${hostname} Email Verification Code`,
      text: message,
    };
    const sendMail = await transporter.sendMail(mailOption);

    if (sendMail.accepted.length > 0) {
      firstStep.token = newToken;
      firstStep.tokensSent = tokensSent + 1;
      firstStep.tokenExpire = Date.now() + 15 * 60 * 1000;
      if (tokensSent === 4) {
        firstStep.holdOnToken = Date.now() + 12 * 60 * 60 * 1000;
        firstStep.tokensSent = 0;
      }
      cookies().set({
        name: "newAccount",
        value: JSON.stringify(firstStep),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
      });
      return new Response(
        JSON.stringify({
          success: true,
          message: `The verification code has been sent to ${verifiedEmail}`,
        }),
        {
          status: 200,
        }
      );
    } else {
      throw new Error(
        "There was a problem sending  verification code, please try again later"
      );
    }
  } catch (error) {
    return errors(error, 200);
  }
}
