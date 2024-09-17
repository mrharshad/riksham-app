import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
// apply pages - senior-product-manager/product-delete-and-update-price-stock

export async function PUT(req) {
  const docId = { _id: "additionalInfo" };
  try {
    dbConnect();
    let {
      _id,
      public_ids,
      token,
      variants,
      name,
      payType,
      imageSets,
      packaging,
      shipping,
      variantPD,
      imgSetPD,
      everyPC,
    } = await req.json();

    const { _id: managerId, role } = jwt.verify(
      token,
      process.env.JWT_SECRET_CODE
    );
    if (!role.includes("Senior Product Manager")) {
      throw new Error("This resource is not for you");
    }
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
      api_key: process.env.CLOUDINARY_CLIENT_API,
      api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
    });

    const updateProduct = await Products.updateOne(
      { _id },
      {
        shipping: shipping,
        packaging: packaging,
        variantPD: variantPD,
        imgSetPD: imgSetPD,
        everyPC: everyPC,
        payType,
        imageSets,
        variants,
      }
    );
    if (updateProduct.modifiedCount === 1 && updateProduct.matchedCount === 1) {
      if (public_ids.length > 0) {
        const deleteImg = await cloudinary.v2.api.delete_resources(public_ids);
        const notDeletedImg = [];
        const deletedObj = deleteImg.deleted;
        for (let i in deletedObj) {
          if (deletedObj[i] !== "deleted") {
            notDeletedImg.push(i);
          }
        }
        if (notDeletedImg.length > 0) {
          const dateFormatter = new Intl.DateTimeFormat("en-In", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const updateAdditionalInfo = await AdditionalInfo.updateOne(docId, {
            $push: {
              nonDeletedImg: {
                _id: dateFormatter.format(new Date()),
                publicId: notDeletedImg,
                nonDIPName: name,
              },
            },
          });
          if (updateAdditionalInfo.modifiedCount !== 1) {
            throw new Error(
              "images that could not be deleted could not be stored in the database either."
            );
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Product price and stock successfully update",
        }),
        {
          status: 200,
        }
      );
    } else {
      throw new Error("product not update");
    }
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message,
      }),
      {
        status: 200,
      }
    );
  }
}
