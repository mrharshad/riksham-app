import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
import errors from "@/backend/utils/errorHandler";
import { v2 } from "cloudinary";
import jwt from "jsonwebtoken";
import AdditionalInfo from "@/backend/models/AdditionalInfo";
// apply pages - product inventory manager - create

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "10mb", // Set desired value here
//     },
//   },
// };
export async function POST(req) {
  const docId = { _id: "additionalInfo" };
  try {
    dbConnect();
    // const dateFormatter = new Intl.DateTimeFormat("en-In", {
    //   timeZone: "Asia/Kolkata",
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    // });
    const newImgPublic_ids = [];
    async function checkDeletedImg(deleteImgs) {
      const notDeletedImg = [];
      const deletedObj = deleteImgs.deleted;
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
    const removeNewImg = async () => {
      if (newImgPublic_ids.length > 0) {
        const deleteImg = await v2.api.delete_resources(newImgPublic_ids);
        await checkDeletedImg(deleteImg);
      }
    };
    let {
      _id,
      token,
      name,
      category,
      brand,
      description,
      des1,
      des2,
      des3,
      aInfo,
      keyValueD,
      tOfP,
      imageSetD,
      imageSets,
      thumbnail,
      variantD,
      variants,
      certificate,
      varKVD,
      varOpt,
      buyers,
      public_ids,
      newImgUpload,
      tOfDelivery,
    } = await req.json();

    let { thumbId, thumbUrl, oldThumbnailId } = thumbnail;
    const { _id: agentId, role } = jwt.verify(
      token,
      process.env.JWT_SECRET_CODE
    );
    if (!role.includes("p-general")) {
      throw new Error("This resource is not for you");
    }
    const imagesLinks = [];

    v2.config({
      cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
      api_key: process.env.CLOUDINARY_CLIENT_API,
      api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
    });

    try {
      if (oldThumbnailId) {
        public_ids.push(oldThumbnailId);
        const thumbnailResult = await v2.uploader.upload(thumbUrl, {
          folder: "P-Thumbnail",
        });
        const { public_id, secure_url } = thumbnailResult;
        newImgPublic_ids.push(thumbId);
        thumbnail = { thumbId: public_id, thumbUrl: secure_url };
      }
      if (newImgUpload) {
        for (let data of imageSets) {
          const { iSN, images } = data;
          let singleSetImg = [];

          for (let imgObj of images) {
            const { imgId, url } = imgObj;
            if (!imgId) {
              const result = await v2.uploader.upload(url, {
                folder: "Product",
              });
              const { public_id, secure_url } = result;

              newImgPublic_ids.push(public_id);
              singleSetImg.push({
                imgId: public_id,
                url: secure_url,
              });
            } else {
              singleSetImg.push({
                imgId,
                url,
              });
            }
          }
          imagesLinks.push({ iSN, images: singleSetImg });
        }
      }
    } catch (err) {
      await removeNewImg();
      throw new Error(err.message);
    }
    try {
      const updateDoc = await Products.updateOne(
        { _id },
        {
          $set: {
            name,
            category,
            brand,
            description,
            des1,
            des2,
            des3,
            tOfP,
            thumbnail,
            variantD: variantD || "",
            certificate,
            varKVD,
            varOpt,
            buyers,
            imageSets: newImgUpload ? imagesLinks : imageSets,
            variants,
            keyValueD,
            aInfo,
            imageSetD: imageSetD || "",
            tOfDelivery,
          },
        }
      );
      if (updateDoc.modifiedCount !== 1 && updateDoc.matchedCount !== 1) {
        throw new Error("Product not updated");
      }
    } catch (err) {
      await removeNewImg();
      throw new Error(err.message);
    }
    let message = "Product Update Successfully";
    if (public_ids.length > 0) {
      try {
        const deleteImg = await v2.api.delete_resources(public_ids);
        await checkDeletedImg(deleteImg);
      } catch (err) {
        message =
          err.message ==
          "images that could not be deleted could not be stored in the database either."
            ? err.message
            : "Product updated successfully but old image could not be deleted";
      }
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
  } catch (error) {
    return errors(error, 200);
  }
}
