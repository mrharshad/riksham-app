import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
import jwt from "jsonwebtoken";
// apply - admin/senior-product-manager/create-product-order
export async function PUT(req) {
  try {
    const body = await req.json();

    const { email, token } = body;
    const role = jwt.verify(token, process.env.JWT_SECRET_CODE)?.role;
    if (!role.includes("Senior Product Manager")) {
      throw new Error("product not found");
    } else {
      dbConnect();
    }

    const findUser = await User.findOne(
      { email: { $regex: email, $options: "i" } },
      {
        address: true,
        createdAt: true,
        state: true,
        email: true,
        fName: true,
        lName: true,
        mobileNo: true,
        pinCode: true,
        district: true,
      }
    );
    if (!findUser) {
      throw new Error("user not found");
    }
    return new Response(JSON.stringify({ success: true, user: findUser }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
