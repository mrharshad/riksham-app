import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import AdditionalInfo from "@/backend/models/AdditionalInfo";

// apply pages - senior-product-manager/product-delete-and-update-price-stock
export async function POST(req) {
  try {
    dbConnect();
    let { public_ids, name, _id: productId, token } = await req.json();
    const { _id, role } = jwt.verify(token, process.env.JWT_SECRET_CODE);
    if (!role.includes("Senior Product Manager")) {
      throw new Error("This resource is not for you");
    }
    const docId = { _id: "additionalInfo" };

    const deleteProduct = await Products.deleteOne({ _id: productId });
    if (deleteProduct.deletedCount === 1) {
      let message = "Product successfully Deleted";
      const totalImg = public_ids.length;
      const values = {
        deletedProduct: { _id: productId, dPName: name, mId: _id },
      };
      let imgDeleteProblem = false;
      if (totalImg > 0) {
        cloudinary.v2.config({
          cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
          api_key: process.env.CLOUDINARY_CLIENT_API,
          api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
        });

        const deleteImg = await cloudinary.v2.api.delete_resources(public_ids);
        const notDeletedImg = [];
        const deletedObj = deleteImg.deleted;
        for (let i in deletedObj) {
          if (deletedObj[i] !== "deleted") {
            notDeletedImg.push(i);
          }
        }

        imgDeleteProblem = notDeletedImg.length > 0;
        if (imgDeleteProblem) {
          values.nonDeletedImg = {
            _id: Date.now(),
            nonDIPName: name,
            publicId: notDeletedImg,
          };
        }
      }
      const pushPDetails = await AdditionalInfo.updateOne(docId, {
        $push: values,
      });
      if (pushPDetails.modifiedCount === 1) {
        if (imgDeleteProblem) {
          message =
            "Some images could not be deleted from Cloudinary that we have stored in the database.";
        }
      } else {
        message =
          "Any details of the deleted product could not be stored in the database.";
      }

      return new Response(
        JSON.stringify({
          success: true,
          message,
        }),
        {
          status: 200,
        }
      );
    } else {
      throw new Error("Product could not be removed");
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
