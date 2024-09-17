import React from "react";
import style from "./imageSets.module.css";
const CrateImagesSets = ({
  Image,
  useSelector,
  useState,
  changeValue,
  useRef,
  dispatch,
  changeDateKey,
  changeStateKey,
  warningAlert,
}) => {
  const { data, public_ids } = useSelector((data) => data.manager);
  let { imageSets, imageSetD, variants, variantD } = data || {};
  const [images, setImages] = useState([]);
  const imagesLength = images.length;
  const difference = useRef();

  const selectedImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      return;
    }

    const validFiles = [];
    for (const img of files) {
      if (img.size <= 409600) {
        validFiles.push(img);
      } else {
        warningAlert(`greater than 400kb: ${img.name}`);
      }
    }

    const loadImage = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            resolve(reader.result);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const loadedImages = [];
    for (const file of validFiles) {
      try {
        const result = await loadImage(file);
        loadedImages.push(result);
      } catch (error) {
        return;
      }
    }

    const uniqueValue = new Set(loadedImages);
    let unique1 = Array.from(uniqueValue);
    const allImg = [];
    allImg.push(...images);
    imageSets.forEach((set) => {
      const images = set.images.map((img) => img.url);
      allImg.push(...images);
    });
    unique1 = unique1.filter((newImg) => {
      if (!allImg.includes(newImg)) {
        return newImg;
      }
    });

    setImages((old) => [...old, ...unique1]);
  };
  const createImgSet = () => {
    const iSN = difference.current.value.trim();
    if (imagesLength > 4 || imagesLength < 1 || iSN.length < 1) {
      return warningAlert("Please check images quantity & difference");
    }
    if (imageSets.some((obj) => obj?.iSN === iSN)) {
      return warningAlert(`${iSN}: image set is already created`);
    }
    const createNewSet = { iSN, images: [] };

    for (let img of images) {
      createNewSet.images.push({ imgId: "", url: img });
    }
    const newDoc = imageSets.concat(createNewSet);
    dispatch(changeDateKey({ name: "imageSets", value: newDoc }));

    difference.current.value = "";
    setImages([]);
  };

  const selectedImageDelete = (setIndex) => {
    setImages((previous) => {
      previous[setIndex] = null;
      return previous.filter((data) => data !== null);
    });
  };

  const deleteCreateColor = (setIndex) => {
    const indexImgSet = imageSets[setIndex].iSN;
    if (
      variants.some((obj) =>
        obj?.options.some((obj) => obj.optID === indexImgSet)
      )
    ) {
      return warningAlert(`${indexImgSet}: image set is used in variants`);
    }
    let deletedSetImages = {};
    const newDoc = imageSets.filter((imgSet, index) => {
      if (setIndex !== index) {
        return imgSet;
      } else {
        deletedSetImages = imgSet;
      }
    });

    let newPublicIds = deletedSetImages.images
      .flatMap((img) => {
        const imgId = img.imgId;
        if (imgId !== "") {
          return imgId;
        } else {
          return [];
        }
      })
      .concat(...public_ids);

    dispatch(changeDateKey({ name: "imageSets", value: newDoc }));
    if (newPublicIds.length > 0) {
      dispatch(changeStateKey({ name: "public_ids", value: newPublicIds }));
    }
  };

  return (
    <>
      <div className={style.createColorsDiv}>
        <p>Create Image Set</p>
        <label className={style.colorDiff} htmlFor="imageSetDifference">
          What is the difference between image sets:
          <input
            defaultValue={imageSetD}
            maxLength={15}
            type="text"
            onChange={changeValue}
            name="imageSetD"
            id="imageSetDifference"
          />
        </label>
        <div className={style.createdColors}>
          {imageSets.map((data, index) => {
            const { iSN, images } = data;
            return (
              <div key={index} className={style.color}>
                <p>{iSN}</p>
                <svg onClick={() => deleteCreateColor(index)}>
                  <path
                    fill="#FF0000"
                    d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                  ></path>
                  <path
                    fill="#FF0000"
                    d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                  ></path>
                </svg>
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

        <label className={style.label}>
          Difference: <input ref={difference} maxLength={15} type="text" />
        </label>
        <div className={style.productImageDiv}>
          {images.map((img, index) => (
            <div className={style.imgDiv} key={index}>
              <svg onClick={() => selectedImageDelete(index)}>
                <path
                  fill="#FF0000"
                  d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                ></path>
                <path
                  fill="#FF0000"
                  d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                ></path>
              </svg>
              <Image
                className={style.productImage}
                key={index}
                alt="product img"
                width={300}
                height={200}
                src={img}
              />
            </div>
          ))}
        </div>
        <div className={style.selectImages}>
          <p>Create Product Images</p>
          <label htmlFor="images">Select Images</label>
          <input
            className={style.inputImages}
            onChange={selectedImages}
            name="images"
            id="images"
            type="file"
            accept="image/*"
            multiple
          />
          <button
            style={{
              display: imagesLength > 0 ? "inline-block" : "none",
            }}
            onClick={createImgSet}
            className={style.addImg}
            type="button"
          >
            Add Images
          </button>
        </div>
      </div>
    </>
  );
};

export default CrateImagesSets;
