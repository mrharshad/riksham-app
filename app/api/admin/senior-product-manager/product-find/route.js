import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
import jwt from "jsonwebtoken";
export async function POST(req) {
  try {
    //  /admin/senior-product-manager/create-product-order
    const { keyword, page, token } = await req.json();
    const limit = process.env.PRODUCT_PER_PAGE;
    const role = jwt.verify(token, process.env.JWT_SECRET_CODE)?.role;
    if (!role.includes("Senior Product Manager")) {
      throw new Error("product not found");
    } else {
      dbConnect();
    }
    const products = await Products.find(
      { name: { $regex: keyword, $options: "i" } },
      {
        buyers: false,
        createdAt: false,
        description: false,
        aInfo: false,
      }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    return new Response(
      JSON.stringify({
        success: true,
        products,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message, products: [] }),
      {
        status: 200,
      }
    );
  }
}
