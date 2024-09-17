import React from "react";
import style from "./update-variant.module.css";
import { changeDateKey } from "@/app/redux/slice/manager";
const UpdateVariant = ({ useState, Image, dispatch, variants, imageSets }) => {
  const [variantsIndex, setVariantIndex] = useState(0);
  const { vD, options } = variants[variantsIndex];

  const numOfOption = options.length;
  const optDeleteAndMove = (index, clicked) => {
    let copyData = JSON.parse(JSON.stringify(variants));
    if (!clicked) {
      copyData[variantsIndex].options = options.filter(
        (data, varIndex) => varIndex !== index
      );
    } else {
      let newOpt = copyData[variantsIndex].options;
      newOpt[index] =
        clicked === "right" ? options[index + 1] : options[index - 1];
      newOpt[clicked === "right" ? index + 1 : index - 1] = options[index];
      copyData[variantsIndex].options = newOpt;
    }

    dispatch(changeDateKey({ name: "variants", value: copyData }));
  };
  const openOptions = (index) => {
    setVariantIndex(index);
  };
  return (
    <div className={style.mainDiv}>
      <p>Change Variant Option Order</p>
      {vD
        ? variants.map((data, index) => {
            const { vD, options } = data;
            return (
              <button
                key={index}
                onClick={() => {
                  openOptions(index);
                }}
                style={{
                  backgroundColor:
                    variantsIndex == index ? "white" : "lightslategray",
                }}
                type="button"
              >
                <span>{options.length}</span> {vD}
              </button>
            );
          })
        : null}
      <div className={style.options}>
        {options.map(({ optID }, optIndex) => {
          const { url } = imageSets.find((data) => data.iSN === optID)
            .images[0];
          return (
            <div className={style.option} key={optIndex}>
              {numOfOption < 2 ? null : (
                <svg onClick={() => optDeleteAndMove(optIndex)}>
                  <path
                    fill="#FF0000"
                    d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                  ></path>
                  <path
                    fill="#FF0000"
                    d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                  ></path>
                </svg>
              )}
              <p>{optID}</p>
              {numOfOption > 1 && optIndex > 0 ? (
                <svg
                  onClick={() => optDeleteAndMove(optIndex, "left")}
                  viewBox="0 0 512 512"
                >
                  <path
                    d="m327.3 98.9-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2L324.9 411l2.6 2.3c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"
                    fill=" #3385ff"
                  ></path>
                </svg>
              ) : null}
              {numOfOption > 1 && numOfOption > optIndex + 1 ? (
                <svg
                  className={style.rightArrow}
                  onClick={() => optDeleteAndMove(optIndex, "right")}
                  viewBox="0 0 512 512"
                >
                  <path
                    d="m184.7 413.1 2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"
                    fill="#3385ff"
                  ></path>
                </svg>
              ) : null}
              <Image
                className={style.img}
                alt="color set image"
                width={300}
                height={200}
                src={url}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdateVariant;
