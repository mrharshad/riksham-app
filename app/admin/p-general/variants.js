import React from "react";
import style from "./variants.module.css";
import { changeDateKey } from "@/app/redux/slice/manager";
import KeyValue from "./keyValue";
const VariantSets = ({
  Image,
  useState,
  useRef,
  dispatch,
  changeValue,
  useSelector,
  warningAlert,
}) => {
  const { data } = useSelector((data) => data.manager);
  const { variants, imageSets, varOpt, varKVD, variantD, imageSetD } = data;
  const differenceInput = useRef();
  const numOfVariant = variants.length;
  const [selectedImgSet, setSelectedImgSet] = useState([]);
  const [rePrint, setRePrint] = useState();

  const selectedImgSetFunc = (iSN) => {
    setSelectedImgSet((previous) => {
      if (previous.includes(iSN)) {
        return previous.filter((data) => data !== iSN);
      } else {
        return [...previous, iSN];
      }
    });
  };

  const deleteVariant = (index) => {
    let copyVariant = [...variants];

    copyVariant = copyVariant.filter((obj, objIndex) => index !== objIndex);
    dispatch(changeDateKey({ name: "variants", value: copyVariant }));
  };

  const crateUpdateVariant = () => {
    let copyVariant = JSON.parse(JSON.stringify(variants));

    const vD = differenceInput.current.value.trim();
    let selected = selectedImgSet;
    if (vD.length === 0 && (variantD || variants[0]?.vD)) {
      return warningAlert("please check the difference input");
    }
    if (selectedImgSet.length === 0) {
      selected = imageSets.map((data) => data.iSN);
    }

    const findVariantIndex = variants.findIndex(
      (obj) => obj.vD === vD || !obj.vD
    );
    if (findVariantIndex >= 0) {
      const createdOptions = copyVariant[findVariantIndex].options;
      selected.forEach((data) => {
        if (!createdOptions.some((opt) => opt.optID === data)) {
          createdOptions.push({
            optID: data,
            purchased: 0,
            mrp: 0,
            loc: [{ s: "Chhattisgarh", d: ["Raipur:10"] }],
          });
        }
      });
      if (!copyVariant[findVariantIndex]?.vD) {
        copyVariant[findVariantIndex].vD = vD;
      }
      copyVariant[findVariantIndex].options = createdOptions;
    } else {
      copyVariant.push({
        vD,
        disOpt: [{ min: 1, dis: 2 }],
        options: selected.map((set) => {
          return {
            optID: set,
            purchased: 0,
            mrp: 0,
            loc: [{ s: "Chhattisgarh", d: ["Raipur:10"] }],
          };
        }),
      });
    }
    dispatch(changeDateKey({ name: "variants", value: copyVariant }));
    setSelectedImgSet([]);
  };

  const [variantIndex, setVariantIndex] = useState(null);
  const { vD } = variants[variantIndex] || {};
  let vkd = varKVD[vD] || [{ "": "" }];

  const openVariantKvd = (index) => {
    setVariantIndex(variantIndex === index ? null : index);
    if (setRePrint) {
      setRePrint(false);
    }
    setTimeout(() => {
      setRePrint(true);
    }, 10);
  };
  const setKeyValueData = (key, value, name, oldKey) => {
    let keyData = key.trim();
    let valueData = value.trim();
    if (keyData.length < 1 || valueData.length < 1 || valueData == keyData) {
      warningAlert("please fill input");
      return false;
    }
    let descriptionData = JSON.parse(JSON.stringify(varKVD));
    let singleKVD = descriptionData[vD];
    if (singleKVD) {
      if (!oldKey || oldKey ? oldKey !== keyData : false) {
        const findKey = singleKVD.some((data) => Object.keys(data) == keyData);

        if (findKey) {
          warningAlert("This key / description already exists");
          return false;
        }

        if (oldKey) {
          singleKVD = singleKVD.map((obj) => {
            if (Object.keys(obj) == oldKey) {
              return { [keyData]: valueData };
            } else {
              return obj;
            }
          });
        } else {
          singleKVD.push({ [keyData]: valueData });
        }
        descriptionData[vD] = singleKVD;
      }
    } else {
      descriptionData[vD] = [{ "": "" }, { [keyData]: valueData }];
    }
    dispatch(changeDateKey({ name, value: descriptionData }));
    return true;
  };
  const deleteKeyValue = (key, name) => {
    let descriptionData = JSON.parse(JSON.stringify(varKVD));
    let singleKVD = descriptionData[vD];

    const filtered = singleKVD.filter((data) => Object.keys(data) != key);
    descriptionData[vD] = filtered;

    dispatch(changeDateKey({ name, value: descriptionData }));
    if (setRePrint) {
      setRePrint(false);
    }

    setTimeout(() => {
      setRePrint(true);
    }, 10);
  };
  return (
    <>
      <div className={style.multipleVariantsDiv}>
        <p className={style.creationType}>Create multiple variant</p>
        <label className={style.variantDiff} htmlFor="variantSetDifference">
          What is the difference between image sets:
          <input
            defaultValue={variantD}
            maxLength={15}
            type="text"
            onChange={changeValue}
            name="variantD"
            id="variantSetDifference"
          />
        </label>
        <div className={style.createdVariants}>
          {variants.map((obj, index) => {
            const { vD, options } = obj;
            return (
              <div
                style={
                  variantIndex === index
                    ? {
                        borderColor: "#0cff0c",
                        maxHeight: "200px",
                        margin: "15px 0px",
                      }
                    : null
                }
                onClick={() => {
                  openVariantKvd(index);
                }}
                key={index}
                className={style.variant}
              >
                <span>
                  {index + 1}: {vD}
                </span>
                {options?.length > 0 ? (
                  <div>
                    <p>{imageSetD || "Option:"}</p>
                    {options.map((color, index) => (
                      <span key={index}>{color.optID}</span>
                    ))}
                  </div>
                ) : null}
                <svg onClick={() => deleteVariant(index)}>
                  <path
                    fill="#FF0000"
                    d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18Z"
                  ></path>
                  <path
                    fill="#FF0000"
                    d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18Z"
                  ></path>
                </svg>
              </div>
            );
          })}
        </div>
        <div className={style.createdColors}>
          {imageSets.map((data, index) => {
            const { iSN, images } = data;
            return (
              <div
                style={{
                  borderColor: selectedImgSet.includes(iSN)
                    ? "#0cff0c"
                    : "white",
                }}
                key={index}
                className={style.createdColor}
              >
                <Image
                  onClick={() => selectedImgSetFunc(iSN)}
                  width={300}
                  height={200}
                  src={images[0].url}
                  alt={"create color"}
                />
                <p>{iSN}</p>
              </div>
            );
          })}
        </div>

        <div className={style.label}>
          <p>Difference:</p>
          <input ref={differenceInput} type="text" />
          <button type="button" onClick={crateUpdateVariant}>
            Update / Create
          </button>
        </div>
        {variantIndex !== null && vD ? (
          <div className={style.variantKvd}>
            <p>
              Variant Name: <span>{vD}</span>{" "}
            </p>
            {rePrint
              ? vkd.map((data, index) => (
                  <KeyValue
                    key={index}
                    useState={useState}
                    keyData={Object.keys(data)[0]}
                    valueData={Object.values(data)[0]}
                    descriptionDataSet={setKeyValueData}
                    useRef={useRef}
                    descriptionDelete={deleteKeyValue}
                    name={"varKVD"}
                  />
                ))
              : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VariantSets;
