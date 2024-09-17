import client from "@/backend/config/redisConnect";
import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
// apply api  - home page me product find

export async function PUT(req) {
  try {
    let { keyName, keyPage, searchSort, type } = await req.json();
    let tOfPFetch = type == "tOfP";

    keyPage = Number(keyPage);
    const sorted = searchSort;
    let sortBy = {};
    switch (searchSort) {
      case "Low to High":
        searchSort = "lTh";
        sortBy = { "variants.0.options.0.current": 1 };
        break;
      case "High to Low":
        searchSort = "hTl";
        sortBy = { "variants.0.options.0.current": -1 };
        break;
      case "New Arrivals":
        searchSort = "na";
        sortBy = { createdAt: -1 };
        break;
      case "Discount":
        sortBy = { "discount.0": -1 };
        break;
      case "Rating":
        sortBy = { rating: -1 };
        break;
      default:
        sortBy = { popular: -1 };
    }

    let data = [];
    const limit = process.env.PRODUCT_PER_PAGE;

    const isSponsored = searchSort == "Popular";
    const url = isSponsored
      ? `${type}:${keyName}`
      : `${searchSort}-tOfP:${keyName}`;

    let skipIndex = (keyPage - 1) * limit;
    skipIndex = skipIndex <= 0 ? 0 : skipIndex;
    if ((!tOfPFetch && isSponsored) || tOfPFetch) {
      // try {
      //   data = await client.lrange(
      //     url,
      //     skipIndex,
      //     skipIndex + limit - 1
      //   );
      // } catch (err) {}
    }

    let dataQty = data.length;

    if (!dataQty) {
      dbConnect();
      data = await Products.find({
        [tOfPFetch ? "tOfP" : "name"]: !tOfPFetch
          ? {
              $regex: keyName,
              $options: "i",
            }
          : keyName,
      })
        .sort(sortBy)
        .skip(skipIndex)
        .limit(limit)
        .exec();
      dataQty = data.length;

      if ((!tOfPFetch && isSponsored) || tOfPFetch) {
        // try {
        //   if (keyPage == 1) {
        //     await client.rpush(
        //       url,
        //       ...data
        //     );
        //     await client.expire(url, 86400); //86400
        //   } else {
        //     await client.rpushx(
        //       url,
        //       ...data
        //     );
        //   }
        // } catch (err) {}
      }
    }

    keyPage = dataQty < 28 ? null : keyPage + 1;

    return new Response(
      JSON.stringify({
        success: true,
        data,
        resPage: keyPage,
        sorted,
        type,
        keyName,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
