import dbConnect from "@/backend/config/dbConnect";
import { verify } from "jsonwebtoken";
import errors from "@/backend/utils/errorHandler";
import { cookies } from "next/headers";
import NewOrders from "@/backend/models/NewOrders";
export async function PUT(req) {
  try {
    let { page, opened } = await req.json();
    const limit = 10;
    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const { _id } = verify(token, process.env.JWT_SECRET_CODE);

    dbConnect();
    let data = await NewOrders.find({ userId: _id })
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        opened,
        newPage: data.length === 10 ? page + 1 : null,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return errors(error, 200);
  }
}
