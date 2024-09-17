"use server";
import dbConnect from "@/backend/config/dbConnect";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
export default async function (data) {
  let { cUsName, cUsEmail, cUsTopic, cUsMessage } = data;
  cUsEmail = cUsEmail.trim();
  cUsMessage = cUsMessage.trim();
  cUsName = cUsName.trim();
  try {
    dbConnect();
    const saveData = await AdditionalInfo.updateOne(
      { _id: "additionalInfo" },
      {
        $push: {
          contactUs: {
            $each: [{ cUsEmail, cUsMessage, cUsName, cUsTopic }],
            $position: 0,
          },
        },
      }
    );
    if (saveData.modifiedCount !== 1) {
      throw new Error("Your message was not accepted");
    }

    return {
      success: true,
      message:
        "We have successfully received your message. We will contact you soon.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
