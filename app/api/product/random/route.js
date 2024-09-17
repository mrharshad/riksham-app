// import dbConnect from "@/backend/config/dbConnect";
import dbConnect from "@/backend/config/dbConnect";
import client from "@/backend/config/redisConnect";
import Products from "@/backend/models/Products";

// apply api  - home page me product find

export async function POST(req) {
  try {
    let { page, intTofP } = await req.json();
    page = Number(page);
    if (!Array.isArray(intTofP)) {
      intTofP = [];
    }
    const data = [];
    const limit = process.env.PRODUCT_PER_PAGE;
    dbConnect();

    const findData = async (currentPage, key, value) => {
      const random = key === "random";
      let valueData = [];
      let skipIndex = (currentPage - 1) * limit;
      skipIndex = skipIndex <= 0 ? 0 : skipIndex;
      // try {
      //   valueData = await client.lrange(
      //     `${key}:${value}`,
      //     skipIndex,
      //     skipIndex + limit - 1
      //   );
      // } catch (err) {}

      let dataQty = valueData.length;

      if (!dataQty) {
        const skipIndex = (currentPage - 1) * limit;
        valueData = await Products.find({
          [random ? "name" : key]: random
            ? {
                $regex: "",
              }
            : value,
        })
          .sort({ [random ? "sponsored" : "nOfB"]: -1 })
          .skip(skipIndex)
          .limit(limit)
          .exec();
        dataQty = valueData.length;

        if (dataQty > 0) {
          // try {
          //   if (currentPage == 1) {
          //     await client.rpush(`${key}:${value}`, ...valueData);
          //   } else {
          //     await client.rpushx(`${key}:${value}`, ...valueData);
          //     await client.expire(`${key}:${value}`, 86400); //86400
          //   }
          // } catch (err) {}
        }
      }
      if (dataQty > 0) {
        data.push(...valueData);
      }
      return dataQty > 27 ? currentPage + 1 : null;
    };

    const intTofPLength = intTofP.length;

    if (intTofPLength) {
      let sorted = [];
      const nullValues = [];
      intTofP.forEach((data) => {
        if (data.page == null) {
          nullValues.push(data);
        } else {
          sorted.push(data);
        }
      });
      sorted = sorted.sort((a, b) => a.page - b.page);
      intTofP = [...sorted, ...nullValues];
    }
    let loop = 0;

    while (loop < 28) {
      const { page: typePage, name } = intTofP[loop] || {};
      if (typePage) {
        const nextPage = await findData(typePage, "tOfP", name);
        intTofP[loop].page = nextPage;
      } else {
        page = await findData(page, "random", "");
      }
      if (data.length >= 28 || page == null) {
        break;
      }
      loop++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        resPage: page,
        resIntTofP: intTofP,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: true,
        message: error.message,
      }),
      {
        status: 200,
      }
    );
  }
}
