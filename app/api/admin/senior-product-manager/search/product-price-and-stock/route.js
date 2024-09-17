import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";

// senior-product-manager/product-delete-and-update-price-stock
export async function POST(req) {
  try {
    const { keyword, page } = await req.json();

    dbConnect();
    const limit = process.env.PRODUCT_PER_PAGE;
    const products = await Products.find(
      { name: { $regex: keyword, $options: "i" } },
      {
        reviews: false,
        rating: false,
        numOfReviews: false,
        ratingInPercent: false,
        category: false,
        brand: false,
        typeOfProduct: false,
        manufacturer: false,
        description: false,
        sponsored: false,
      }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    return new Response(JSON.stringify({ success: true, products }), {
      status: 200,
    });
  } catch (error) {
    const { code, message } = error;
    return new Response(JSON.stringify({ success: false, message: message }), {
      status: 200,
    });
  }
}
