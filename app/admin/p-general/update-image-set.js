import React from "react";
import style from "./update-image-set.module.css";
import { changeStateKey } from "@/app/redux/slice/manager";
const UpdateImageSet = ({
  Image,
  useState,
  useSelector,
  dispatch,
  changeDateKey,
  useEffect,
  warningAlert,
}) => {
  try {
    const { data, public_ids } = useSelector((data) => data.manager);
    let { imageSets, variants, varOpt } = data || {};

    const numOfVariant = variants.length;
    const [colorIndex, setColorIndex] = useState(0);

    const { iSN, images } = imageSets[colorIndex];
    const [uniqueName, setUniqueName] = useState({
      unique: false,
      uniqueValue: iSN,
    });
    const totalImages = images.length;
    const editImageName = (oldName, newName) => {
      const copyVariant = JSON.parse(JSON.stringify(variants));
      const copyImageSets = JSON.parse(JSON.stringify(imageSets));
      setUniqueName({
        unique: false,
        uniqueValue: iSN,
      });

      if (numOfVariant > 0) {
        for (let data of copyVariant) {
          const { vD, disOpt, options } = data;
          if (disOpt.length > 0) {
            const find = options.some((color) => color.optID === oldName);
            if (find) {
              warningAlert(
                `This color has been used in ${vD}. You cannot change the name.`
              );
              return;
            }
          }
        }
      }

      copyImageSets[colorIndex].iSN = newName;

      dispatch(changeDateKey({ name: "imageSets", value: copyImageSets }));
      if (numOfVariant) {
        copyVariant.forEach((variant, varIndex) => {
          variant.options.forEach((opt, optIndex) => {
            if (opt.optID === oldName) {
              copyVariant[varIndex].options[optIndex].optID = newName;
            }
          });
        });
        dispatch(changeDateKey({ name: "variants", value: copyVariant }));
      }
      if (varOpt?.length > 0) {
        varOpt.forEach((data) => {
          const [varName, imgSetName] = data.varOptN.split(":");
          data.varOptN = `${varName}:${newName}`;
          newDoc.push(data);
        });
        dispatch(changeDateKey({ name: "varOpt", value: newDoc }));
      }
    };

    const editImage = (query) => {
      const { name, index, value, clicked } = query;
      let newImagSet = "";
      if (name == "move") {
        newImagSet = images.with(
          index,
          clicked === "right" ? images[index + 1] : images[index - 1]
        );
        newImagSet = newImagSet.with(
          clicked === "right" ? index + 1 : index - 1,
          images[index]
        );
        newImagSet = { iSN, images: newImagSet };
      } else if (name === "delete") {
        if (value) {
          const newPublicIds = public_ids.concat(...[value]);
          dispatch(changeStateKey({ name: "public_ids", value: newPublicIds }));
        }
        newImagSet = {
          iSN,
          images: images.filter((data, imgIndex) => index !== imgIndex),
        };
      } else if (name == "new-image") {
        newImagSet = {
          iSN,
          images: images.concat({ imgId: "", url: value }),
        };
      }
      const newDoc = [];
      for (let color of imageSets) {
        if (color.iSN == iSN) {
          newDoc.push(newImagSet);
        } else {
          newDoc.push(color);
        }
      }
      dispatch(changeDateKey({ name: "imageSets", value: newDoc }));
    };
    const selectedImages = (e) => {
      const files = Array.from(e.target.files);
      files.forEach((img, index) => {
        if (img.size > 409600) {
          warningAlert(`greater than 400kb: ${img.name}`);
          delete files[index];
        }
      });
      if (files.length === 0) {
        return;
      }
      const reader = new FileReader();
      const allImg = [];
      imageSets.forEach((set) => {
        const images = set.images.map((img) => img.url);
        allImg.push(...images);
      });
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (allImg.includes(reader.result)) {
            return warningAlert("Image exists in color set");
          } else if (totalImages < 4) {
            editImage({ name: "new-image", value: reader.result });
          }
        }
      };
      reader.readAsDataURL(files[0]);
      // });
    };

    const findUniqueName = (e) => {
      const value = e.target.value.trim();
      const findName = imageSets.some((imgSet) => imgSet.iSN === value);
      setUniqueName({
        unique: !findName && value ? true : false,
        uniqueValue: value,
      });
    };
    useEffect(() => {
      setUniqueName({
        unique: false,
        uniqueValue: iSN,
      });
    }, [colorIndex]);
    return (
      <div className={style.mainContainer}>
        <p>Update Image Set</p>
        <div className={style.createdColors}>
          {imageSets.map((data, index) => {
            const { iSN, images } = data;
            return (
              <div
                onClick={() => {
                  setColorIndex(index);
                }}
                style={{
                  borderColor: colorIndex == index ? "#0cff0c" : "white",
                }}
                key={index}
                className={style.createdColor}
              >
                <p>{iSN}</p>
                <Image
                  width={300}
                  height={200}
                  src={images[0].url}
                  alt={"create color"}
                />
              </div>
            );
          })}
        </div>

        <div className={style.label}>
          Set name change:
          <input maxLength={15} onChange={findUniqueName} type="text" />
          {uniqueName.unique ? (
            <button
              onClick={(e) => {
                editImageName(iSN, uniqueName.uniqueValue);
              }}
              type="button"
            >
              rename
            </button>
          ) : null}
        </div>

        <div id={style.editImgSet} className={style.createdColors}>
          {images.map((img, index) => {
            const { url, imgId } = img;

            return (
              <div id={style.color} className={style.createdColor} key={index}>
                {totalImages > 1 ? (
                  <svg
                    onClick={() =>
                      editImage({ name: "delete", index, value: imgId })
                    }
                  >
                    <path
                      fill="#FF0000"
                      d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                    ></path>
                    <path
                      fill="#FF0000"
                      d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                    ></path>
                  </svg>
                ) : null}
                {totalImages > 1 && index > 0 ? (
                  <svg
                    onClick={() =>
                      editImage({ name: "move", index, clicked: "left" })
                    }
                    viewBox="0 0 512 512"
                    className={style.leftArrow}
                  >
                    <path
                      d="m327.3 98.9-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2L324.9 411l2.6 2.3c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"
                      fill=" #3385ff"
                    ></path>
                  </svg>
                ) : null}
                {totalImages > 1 && totalImages > index + 1 ? (
                  <svg
                    className={style.rightArrow}
                    onClick={() =>
                      editImage({ name: "move", index, clicked: "right" })
                    }
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="m184.7 413.1 2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"
                      fill="#3385ff"
                    ></path>
                  </svg>
                ) : null}
                <Image
                  className={style.productImage}
                  key={index}
                  alt="product img"
                  width={300}
                  height={200}
                  src={url}
                />
              </div>
            );
          })}
        </div>
        {totalImages < 4 ? (
          <p className={style.selectImages}>
            Add new image:
            <label htmlFor="images">Choose Image</label>
            <input
              className={style.inputImages}
              onChange={selectedImages}
              name="images"
              id="images"
              type="file"
              accept="image/*"
            />
          </p>
        ) : null}
      </div>
    );
  } catch (err) {}
};

export default UpdateImageSet;
