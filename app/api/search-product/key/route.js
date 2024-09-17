import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
export async function POST(req) {
  try {
    // apply pages - product-inventory-manager
    const { key, page } = await req.json();
    console.log("search product key", key, page);
    const limit = 10;
    dbConnect();
    const data = await Products.find(
      { name: { $regex: key, $options: "i" } },
      {
        popular: false,
      }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    const total = data.length;
    return new Response(
      JSON.stringify({
        success: true,
        data,
        nextPage: total == 10 ? page + 1 : 0,
        total,
        searchKey: key,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message, nextPage: 0 }),
      {
        status: 200,
      }
    );
  }
}
