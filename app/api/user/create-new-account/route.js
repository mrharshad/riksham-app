import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import nodeMailer from "nodemailer";
import Jwt from "jsonwebtoken";
import client from "@/backend/config/redisConnect";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
import EmailValidate from "@/backend/models/EmailValidate";
import { hash } from "bcrypt";
import { cookies } from "next/headers";
// apply api - /user/sign-up
export async function POST(req) {
  try {
    const response = (message, status, tokensSent) => {
      return new Response(
        JSON.stringify({
          success: true,
          message,
          tokensSent,
        }),
        {
          status,
        }
      );
    };
    const hostname = new URL(req.url).hostname;
    let {
      fName,
      lName,
      email,
      address,
      mobileNo,
      birth,
      gender,
      validCode,
      password,
      intTofP,
      searchKeys,
      pinCode,
      district,
      state,
      area,
    } = await req.json();
    let [userName, domain] = email.toLowerCase().trim().split("@");
    if (userName.length < 3) {
      throw new Error("Enter valid email");
    }
    email = userName + "@gmail.com";
    const { dateType } = birth;
    let findUser;
    // let dataBase = "mongodb"; // jab redis kv ka use krenge to mongodb ki jagha par redis likhenge
    let dataBase = "mongodb";
    const docId = { _id: "additionalInfo" };
    // try {
    //   findUser = await client.hgetall(`newAccount:${email}`);
    // } catch {}
    dbConnect();
    if (findUser) {
      dataBase = "redis";
    } else {
      findUser = await EmailValidate.findById(email);
      if (!findUser) {
        findUser = await User.findOne({ email });
        if (findUser) {
          throw new Error(`already has an account created`);
        }
      }
    }
    const newToken = () => {
      const characters =
        "ABCstuDE67FGHIJKOPQRSTUVWXabcdefghijklmnopqrvwxyzYZ0123458LM9N";
      let randomString = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }
      return {
        randomString,
        token: Jwt.sign(
          { token: randomString, email },
          process.env.JWT_SECRET_CODE,
          {
            expiresIn: "15m",
            algorithm: "HS256",
          }
        ),
      };
    };

    const sendToken = async (randomString) => {
      const transporter = nodeMailer.createTransport({
        service: process.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: true,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const message = `Hi ${fName} \n\n We have received a request to sign up on ${hostname} via your email address. Your ${hostname} verification code is: \n\n Verification Code : ${randomString} \n\n If you did not request this code, it is possible that someone else is trying to sign up for ${hostname}. Do not forward or give this code to anyone. \n\n You received this message because your @gmail address was used to sign up on ${hostname}.`;
      const mailOption = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: `${hostname} Email Verification Code`,
        text: message,
      };
      const sendMail = await transporter.sendMail(mailOption);
      if (!sendMail.accepted.length) {
        throw new Error(
          "There was a problem sending  verification code, please try again later"
        );
      }
    };
    const manageToken = async (data, type) => {
      if (type == "update") {
        data.tokensSent = +data.tokensSent + 1;
        if (data.tokensSent >= 5) {
          data.hold = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
      }
      if (data.tokensSent >= 5) {
        data.tokensSent = 0;
      }

      if (dataBase == "redis" && type == "create") {
        await client.hset(`newAccount:${email}`, data);
        await client.expire(`newAccount:${email}`, 86400); //86400
      } else if (dataBase == "redis" && type == "update") {
        await client.hset(`newAccount:${email}`, data);
        await client.expire(`newAccount:${email}`, 86400); //86400
      } else if (dataBase == "redis" && type == "delete") {
        await client.del(`newAccount:${email}`);
      } else if (dataBase == "mongodb" && type == "create") {
        const crete = await EmailValidate.create(data);
        if (!crete) {
          throw new Error("Contact our team or try again later");
        }
      } else if (dataBase == "mongodb" && type == "update") {
        delete data._id;
        const update = await EmailValidate.updateOne(
          {
            _id: email,
          },
          { $set: data }
        );
        if (update.modifiedCount === 0) {
          throw new Error("Contact our team or try again later");
        }
      } else if (dataBase == "mongodb" && type == "delete") {
        await EmailValidate.deleteOne({
          _id: email,
        });
      }
    };
    const holdTime = (hold) => {
      const pendingTime = ((hold - Date.now()) / 60 / 60 / 1000)
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
    };
    const finalTask = async (findUser, method) => {
      if (method === "update" && findUser.tokensSent == 4) {
        await manageToken(findUser, method);
        return holdTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
      }
      const { randomString, token } = newToken();
      await sendToken(randomString);
      findUser.token = token;
      await manageToken(findUser, method);
    };
    if (findUser) {
      let { hold, token: clientToken, tokensSent } = findUser;
      hold = new Date(hold);

      if (hold > Date.now()) {
        holdTime(hold);
      }

      if (validCode) {
        try {
          const storedToken = Jwt.verify(
            clientToken,
            process.env.JWT_SECRET_CODE
          );

          if (storedToken.token === validCode) {
            function capitalizeWords(str) {
              return str.replace(/\b\w/g, function (txt) {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              });
            }
            area = capitalizeWords(area.toLowerCase().trim());
            if (
              mobileNo.trim().length !== 10 ||
              pinCode.trim().length !== 6 ||
              area.length > 20
            ) {
              throw new Error("information  is incorrect");
            }
            const hashedPassword = await hash(password, 10);

            fName = capitalizeWords(fName.toLowerCase().trim());
            lName = capitalizeWords(lName.toLowerCase().trim());
            address = capitalizeWords(address.toLowerCase().trim());
            district = capitalizeWords(district.toLowerCase().trim());
            state = capitalizeWords(state.toLowerCase().trim());
            gender = capitalizeWords(gender.toLowerCase().trim());

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
              const [bYear, bMonth, bDate] = dateType.split("-");
              intTofP = Array.isArray(intTofP) ? intTofP.slice(0, 10) : [];
              searchKeys = Array.isArray(searchKeys)
                ? searchKeys.slice(0, 10)
                : [];

              intTofP = intTofP.flatMap((data) => data.name);
              searchKeys = searchKeys.map((data) => JSON.stringify(data));
              const newData = {
                _id: findLastId.lastUserId,
                fName,
                lName,
                password: hashedPassword,
                email: storedToken.email,
                mobileNo,
                location: [
                  {
                    _id: Date.now(),
                    address,
                    pinCode,
                    state,
                    district,
                    area,
                  },
                ],
                role: ["User"],
                bDate,
                bMonth,
                bYear,
                gender,
                intTofP,
                searchKeys,
                tokens: {},
                issues: {},
                createdAt: Date.now(),
              };
              const createData = await User.create(newData);
              const jwtToken = Jwt.sign(
                {
                  _id: createData._id,
                  role: ["User"],
                },
                process.env.JWT_SECRET_CODE,
                {
                  expiresIn: process.env.JWT_EXPIRE_TIME,
                  algorithm: "HS256",
                }
              );
              cookies().set({
                name: process.env.COOKIE_TOKEN_NAME,
                value: jwtToken,
                expires: new Date(
                  Date.now() +
                    process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                path: "/", // all path
              });
              await manageToken(findUser, "delete");
              // try {
              //   await client.hset(`user:${findLastId.lastUserId}`, newData);
              // } catch (err) {}
              newData.token = jwtToken;
              delete newData.password;
              newData.numOfCartP = 0;
              newData.cartPro = [];
              newData.location = createData.location;
              newData.createdAt = createData.createdAt;
              return response("Account created successfully ", 201, newData);
            } catch (err) {
              await AdditionalInfo.updateOne(docId, {
                $inc: { lastUserId: -1 },
              });
              throw new Error(err.message);
            }
          } else {
            await finalTask(findUser, "update");
            return response(
              `Verification code is incorrect New code sent to ${email}`,
              200,
              tokensSent
            );
          }
        } catch (err) {
          const errMsg = err.message;
          if (errMsg !== "jwt expired") {
            throw new Error(errMsg);
          }
        }
      }
      await finalTask(findUser, "update");
      return response(
        `Token has expired New code sent to ${email}`,
        200,
        tokensSent
      );
    }
    findUser = { _id: email, tokensSent: 1 };
    await finalTask(findUser, "create");
    return response(`The verification code has been sent to ${email}`, 200);
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
//
