import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
import errors from "@/backend/utils/errorHandler";
import jwt from "jsonwebtoken";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
import { v2 } from "cloudinary";
// apply pages - p-general

export async function DELETE(req) {
  const docId = { _id: "additionalInfo" };

  try {
    dbConnect();

    v2.config({
      cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
      api_key: process.env.CLOUDINARY_CLIENT_API,
      api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
    });

    const searchParams = req.nextUrl.searchParams;
    // const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const _id = searchParams.get("_id");
    const { _id: mId, role } = jwt.verify(token, process.env.JWT_SECRET_CODE);
    if (!role.includes("p-general")) {
      throw new Error("This resource is not for you");
    }

    const deletedProduct = await Products.findByIdAndDelete({ _id });
    if (!deletedProduct) {
      throw new Error("Product not Deleted");
    }

    const { name, imageSets, thumbnail } = deletedProduct;
    const public_ids = [];
    public_ids.push(thumbnail.thumbId);
    imageSets.forEach((sets) =>
      sets.images.forEach((imgObj) => public_ids.push(imgObj.imgId))
    );

    const deleteImg = await v2.api.delete_resources(public_ids);

    const notDeletedImg = [];
    const deletedObj = deleteImg.deleted;
    for (let i in deletedObj) {
      if (deletedObj[i] !== "deleted") {
        notDeletedImg.push(i);
      }
    }
    const queryObj = { deletedProduct: { mId, name, _id } };
    if (notDeletedImg.length > 0) {
      queryObj.nonDeletedImg = {
        _id: dateFormatter.format(new Date()),
        publicId: notDeletedImg,
        nonDIPName: name,
      };
    }
    const updateAdditionalInfo = await AdditionalInfo.updateOne(docId, {
      $push: queryObj,
    });

    if (updateAdditionalInfo.modifiedCount !== 1) {
      throw new Error("Deleted product details not stored in database");
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `${name} has been successfully deleted`,
        _id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return errors(error, 200);
  }
}
