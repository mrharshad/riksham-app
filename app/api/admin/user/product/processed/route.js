import dbConnect from "@/backend/config/dbConnect";
import { verify } from "jsonwebtoken";
import errors from "@/backend/utils/errorHandler";
import { cookies } from "next/headers";
import User from "@/backend/models/user";
export async function PUT(req) {
  try {
    const { opened, page, searchKey } = await req.json();

    const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
    const { _id } = verify(token, process.env.JWT_SECRET_CODE);

    dbConnect();
    let data;
    const limit = 10;
    if (searchKey != undefined) {
      const all = await User.findById(_id, {
        delivered: 1,
      });
      data = all.delivered.flatMap((obj) => {
        const newItems = obj.items.filter((item) =>
          item.name.includes(searchKey)
        );
        if (newItems.length) {
          obj.items = newItems;
          return obj;
        } else return [];
      });
    } else {
      data = await User.findById(_id, {
        [opened]: 1,
        projection: {
          [opened]: { $slice: [(page - 1) * limit, limit] },
        },
      });
      data = data[opened];
    }
    return new Response(
      JSON.stringify({
        success: true,
        data,
        opened,
        newPage:
          searchKey != undefined ? 1 : data.length === 10 ? page + 1 : null,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return errors(error, 200);
  }
}
