"use client";
import { useState, Fragment, useRef, useEffect, useMemo } from "react";
import style from "./newProduct.module.css";
import Image from "next/image";
import KeyValue from "./keyValue";
import Description from "./description";
import { UserAlert, Wait } from "@/app/Layouts/toastAndWait";
import { useDispatch, useSelector } from "react-redux";
import {
  dataSelect,
  getDrafts,
  changeDateKey,
  filterOption,
  requiredDesc,
  changeStateKey,
  searchProduct,
  draftDelete,
  removeUpdatedDoc,
  deleteProduct,
} from "@/app/redux/slice/manager";
import Options from "./options";
import Handler from "./handler";
import CrateImagesSets from "./imageSets";
import VariantSets from "./variants";
import UpdateImageSet from "./update-image-set";
import Certificates from "./certificate";
import UpdateVariant from "./update-variant";
import PriceAndStock from "./priceAndStock";
import allStates from "../../Layouts/locationState";
const NewProductComponent = () => {
  try {
    const dispatch = useDispatch();
    const { token } = useSelector((data) => data.user);

    const {
      data,
      loading,
      optFiltered,
      requiredData,
      category: categories,
      tOfP: tOfPS,
      brand: brands,
      requiredCertificate,
      requiredAInfo,
      requiredKeyValueD,
      container,
      openedDraft,
      searchResult,
      searchPage,
      searchKey,
      searchData,
      drafts,
      public_ids,
    } = useSelector((data) => data.manager);
    let {
      _id,
      category,
      tOfP,
      name,
      brand,
      keyValueD,
      aInfo,
      description,
      variants,
      imageSets,
      thumbnail,
      certificate,
      des1,
      des2,
      des3,
      buyers,
      imgSetPD,
      variantPD,
    } = data || {};
    const numOfSearchResult = searchResult?.length;
    const [renderComponent, setRenderComponent] = useState(false);

    const { thumbId, thumbUrl } = thumbnail || {};
    const changeValue = (e) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;

      dispatch(changeDateKey({ name, value }));
    };

    const categorySelect = (value, clear) => {
      if (!value) {
        return;
      }
      const findCategory = requiredData.find(
        (cate) => cate?.category === value
      );
      if (findCategory) {
        dispatch(changeStateKey({ name: "tOfP", value: findCategory.tOfPS }));
        dispatch(changeStateKey({ name: "brand", value: findCategory.brands }));
      } else {
        dispatch(requiredDesc(value));
      }
      dispatch(changeDateKey({ name: "category", value, clear }));
    };
    const searchOption = (e) => {
      const target = e.target;
      dispatch(filterOption({ optName: target.name, key: target.value }));
    };
    const requireDataSet = (key) => {
      let requireName = "";
      let require = requiredData.find((cate) => cate?.category === category);
      switch (key) {
        case "keyValueD":
          require = require.keyValueD;
          requireName = "requiredKeyValueD";
          break;
        case "aInfo":
          require = require.aInfo;
          requireName = "requiredAInfo";
          break;

        default:
          require = require.certificate;
          requireName = "requiredCertificate";
      }

      const totalRequire = key == "certificate" ? [] : [{ "": "" }];
      const requireTOfP = require[tOfP];
      require = require.common;
      if (requireTOfP) {
        require = requireTOfP.concat(require);
      }
      const oldData = data[key];
      const length = oldData.length;
      if (key !== "certificate") {
        const converted = [];
        if (openedDraft == 0 && _id && typeof oldData[0] == "string") {
          for (let loop = 0; loop < length; ) {
            converted.push({ [oldData[loop]]: oldData[loop + 1] });
            loop = loop + 2;
          }
        } else {
          converted.push(...oldData);
        }
        for (let reqKey of require) {
          const value = converted.find((obj) => Object.keys(obj) == reqKey);
          totalRequire.push({ [reqKey]: value ? value[reqKey] : "" });
        }

        for (let old of converted) {
          const key = Object.keys(old)[0];
          const findKey = totalRequire.some((data) => Object.keys(data) == key);
          if (!findKey) {
            totalRequire.push(old);
          }
        }
      } else {
        for (let reqKey of require) {
          const findData = oldData.find((data) => data.cN == reqKey);
          if (!findData) {
            totalRequire.push({ cN: reqKey, cImages: [] });
          } else {
            totalRequire.push(findData);
          }
        }
        if (length) {
          for (let data of oldData) {
            const key = data.cN;
            const findData = totalRequire.some((data) => data.cN == key);
            if (!findData) {
              totalRequire.push(data);
            }
          }
        }
      }
      dispatch(changeStateKey({ name: requireName, value: require }));

      return totalRequire;
    };
    const userAlert = (value) => {
      dispatch(changeStateKey({ name: "loading", value }));
    };
    const warningAlert = (message) => {
      userAlert({
        type: "Warning",
        message,
      });
      setTimeout(() => {
        userAlert(false);
      }, 2000);
    };
    const descriptionDataSet = (key, value, name, oldKey) => {
      let keyData = key.trim();
      let valueData = value.trim();
      if (keyData.length < 1 || valueData.length < 1 || valueData == keyData) {
        alert("please fill input");
        return false;
      }

      const notOpenDescription = name !== "description";
      const descriptionData = data[name];
      if (!oldKey || oldKey ? oldKey !== keyData : false) {
        const findKeyVal = (data) => Object.keys(data) == keyData;
        const findKeyDes = (data) => data == valueData;

        const findKey = descriptionData.some(
          notOpenDescription ? findKeyVal : findKeyDes
        );
        if (findKey) {
          alert("This key / description already exists");
          return false;
        }
      }
      const setKVDescription = (obj) => {
        if (Object.keys(obj) == oldKey) {
          return { [keyData]: valueData };
        } else {
          return obj;
        }
      };
      const setDescription = (str) => {
        if (str == oldKey) {
          return valueData;
        } else {
          return str;
        }
      };

      let newData =
        notOpenDescription && oldKey
          ? descriptionData.map(setKVDescription)
          : !notOpenDescription && oldKey
          ? descriptionData.map(setDescription)
          : null;

      if (!newData) {
        if (notOpenDescription && !oldKey) {
          newData = descriptionData.concat([{ [keyData]: valueData }]);
        } else {
          newData = descriptionData.concat([valueData]);
        }
      }
      dispatch(changeDateKey({ name, value: newData }));
      return true;
    };

    const descriptionDelete = (key, name) => {
      let requireData = name == "keyValueD" ? requiredKeyValueD : requiredAInfo;
      const notOpenDescription = name !== "description";

      if (notOpenDescription) {
        if (requireData.includes(key)) {
          return alert("It is required key and cannot be deleted.");
        }
      }
      setRenderComponent(name);
      const allData = data[name];
      const filterKVD = (data) => Object.keys(data) != key;

      const filterDes = (data) => data !== key;

      const filtered = allData.filter(
        notOpenDescription ? filterKVD : filterDes
      );

      dispatch(changeDateKey({ name, value: filtered }));
      setTimeout(() => {
        setRenderComponent(false);
      }, 100);
    };

    const deleteProductFunc = (_id, name) => {
      const confirmation = confirm(
        `Do you want to remove ${name} from the database?`
      );
      if (confirmation) {
        dispatch(deleteProduct({ _id, token }));
      }
    };

    async function updateCreate() {
      const errorThrow = (mgs) => {
        throw new Error(mgs);
      };
      if (loading) return warningAlert("Try again");
      userAlert(true);
      let type = "Warning";

      try {
        let {
          aInfo,
          certificate,
          description,
          imageSetD,
          imageSets,
          keyValueD,
          varKVD: rawVarKVD,
          variants,
          variantD,
          buyers,
          varOpt,
        } = data;
        const numOfVariant = variants.length;
        if (thumbUrl.length < 50) {
          errorThrow("please select thumbnail image");
        }

        const lengthChecker = (data, name, maxLength, minLength) => {
          if (data.length > maxLength) {
            errorThrow(
              `You cannot enter more than ${maxLength} words of text ${name}`
            );
          }
          if (data.length < minLength) {
            errorThrow(
              `You cannot enter more less ${minLength} words of text ${name}`
            );
          }
        };
        lengthChecker(name, "name", 75, 10);
        !imgSetPD && lengthChecker(des1, "first description", 45, 10);
        lengthChecker(des2, "second description", 45, 10);
        lengthChecker(des3, "third description", 45, 10);
        const finalPublicId = [...public_ids];
        function capitalizeWords(str) {
          return str.replace(/\b\w/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }

        if (imageSets.length < 1) {
          errorThrow("Upload Minimum 1 image Set");
        } else if (imageSets.length > 4 && !_id) {
          errorThrow("Upload Maximum 4 image Set");
        } else if (description.length < 3) {
          errorThrow("Please write product description");
        }
        if (numOfVariant > 1 && !variantD) {
          throw new Error("Mention differences between variants");
        }
        if (!numOfVariant) {
          throw new Error("Please Create Variant");
        }

        description = description.filter((data, index) => index !== 0);

        const checkRequire = (data, name, required) => {
          const newData = [];
          const total = data.length;
          if (name !== "certificate") {
            if (!total) {
              errorThrow(`There must be at least 4 lines of ${name}`);
            }
            for (let loop = 0; loop < total; loop++) {
              const key = Object.keys(data[loop])[0];
              const value = Object.values(data[loop])[0];
              if (loop > 0) {
                if (!value) {
                  errorThrow(`Please enter ${key} value`);
                }
                if (key !== required[loop - 1] && required.length >= loop) {
                  errorThrow(
                    `The ${key} is of a required key that is not in the correct location`
                  );
                }
                newData.push(...[key, value]);
              }
            }
          } else {
            if (total === 0 && required.length > 0) {
              errorThrow("enter the image link of the required certificate.");
            }
            if (total > 10) {
              errorThrow("Cannot upload more than 10 certificates");
            }
            for (let req of required) {
              if (!data.some(({ cN }) => cN === req)) {
                errorThrow(`${req} - certificate is required`);
              }
            }
            for (let loop = 0; loop < total; loop++) {
              const cImages = data[loop]?.cImages;
              if (cImages.length > 4 || cImages.length == 0) {
                errorThrow(
                  "1 to 4 images have to be uploaded in one certificate"
                );
              }
            }
          }
          return newData;
        };

        keyValueD = checkRequire(keyValueD, "keyValueD", requiredKeyValueD);
        aInfo = checkRequire(aInfo, "aInfo", requiredAInfo);
        checkRequire(certificate, "certificate", requiredCertificate);
        let removeImgSets = imageSets.map((obj) => obj.iSN);

        for (let variant of variants) {
          let { vD, disOpt, options } = variant;
          if (variantD && !vD) {
            errorThrow("What is the difference between the variants?");
          }
          if (!disOpt.length) {
            errorThrow(`${vD} There is no discount option in 1 kg`);
          }

          if (options.length == 0) {
            errorThrow(`${vD} variant cannot be made without options`);
          }
          if (options.length > 1 && !imageSetD) {
            errorThrow(`Mention what is the difference in the image set`);
          }

          for (let i = 0; i < disOpt.length; i++) {
            const { min, dis } = disOpt[i];
            if (
              disOpt.some(
                (opt, index) =>
                  (index > i && (opt.min <= min || opt.dis <= dis)) || !min
              )
            ) {
              errorThrow(
                `Check status and discount percentage in ${vD} discount option`
              );
            }
          }
          const numOfOpt = options.length;
          const lastDis = disOpt[disOpt.length - 1].dis;
          for (let optIndex = 0; optIndex < numOfOpt; optIndex++) {
            const { optID, mrp, purchased, loc } = options[optIndex];
            if (!optID) {
              errorThrow(`Set ${vD} option id`);
            }
            const index = removeImgSets.findIndex(
              (element) => element == optID
            );
            if (!loc.length) {
              errorThrow(`Check location Stock`);
            }

            if (
              ((!imgSetPD && optIndex < 1) || imgSetPD) &&
              (mrp < 9 || !purchased || purchased < lastDis || purchased > 300)
            ) {
              errorThrow(
                `Check price and purchase percentage of ${vD} - ${optID}`
              );
            }

            if (index >= 0) {
              delete removeImgSets[index];
            }
            for (let { s, d } of loc) {
              if (!d?.length) {
                errorThrow(`Check Stock in ${vD} - ${optID}`);
              }

              for (let i of d) {
                const [dis, qty] = i.split(":");
                if (Number(qty) < 1) {
                  errorThrow(`Check Stock in ${vD} - ${optID}`);
                }
              }
            }
          }
        }

        if (!imgSetPD) {
          variants = variants.map((obj) => {
            const copyObj = { ...obj };
            const { mrp, purchased } = copyObj.options[0];

            copyObj.options = copyObj.options.map(({ ...opt }, index) => {
              if (index > 0) {
                opt.mrp = mrp;
                opt.purchased = purchased;
                return opt;
              }
              return opt;
            });

            return copyObj;
          });
        }

        removeImgSets = removeImgSets.filter((name) => name);

        for (let i = 0; i < removeImgSets.length; i++) {
          const confirmDelete = confirm(
            `${removeImgSets[i]} ${imageSetD} is not being used. Would you like to delete it?`
          );
          if (!confirmDelete) {
            delete removeImgSets[i];
          }
        }

        removeImgSets = removeImgSets.filter((name) => name);
        let newImgUpload = false;

        if (removeImgSets.length > 0) {
          imageSets = imageSets.flatMap((set) => {
            const { iSN, images } = set;
            const checkName = removeImgSets.includes(iSN);
            const imgIds = images.flatMap((img) => {
              if (img.imgId) {
                return img.imgId;
              } else {
                if (!checkName) {
                  newImgUpload = true;
                }
                return [];
              }
            });
            if (checkName) {
              finalPublicId.push(...imgIds);
              return [];
            } else {
              return set;
            }
          });
        } else {
          newImgUpload = imageSets.some((set) =>
            set.images.some((img) => !img.imgId)
          );
        }
        if (variantD) {
          variantD = capitalizeWords(variantD.toLowerCase());
        }
        const findCategory = requiredData.find(
          (data) => data.category === category
        );
        if (!findCategory) errorThrow("Please select valid category");

        if (!findCategory.tOfPS.some((data) => data === tOfP)) {
          errorThrow("Please select valid type of product");
        }

        if (!findCategory.brands.some((data) => data === brand)) {
          errorThrow("Please select valid brand");
        }

        imageSetD = capitalizeWords(imageSetD.toLowerCase());

        const varKVD = {};
        for (let key in rawVarKVD) {
          if (variants.some((variant) => variant.vD == key)) {
            const convert = [];
            rawVarKVD[key].forEach((obj, index) => {
              const objKey = Object.keys(obj)[0];
              if (index !== 0) convert.push(objKey, obj[objKey]);
            });
            varKVD[key] = convert;
          }
        }
        let newProduct = await fetch(
          `/api/admin/p-general/${_id ? "update" : "create"}`,
          {
            method: "POST",
            body: JSON.stringify({
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
              public_ids: finalPublicId,
              newImgUpload,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await newProduct.json();
        const { success, message } = result;

        if (success) {
          if (!_id) {
            const findDraft = drafts.find(
              (data) => data.draftId == openedDraft
            );
            if (findDraft) {
              const draftConfirmation = confirm(
                `Delete Draft: ${findDraft.data.name}`
              );
              if (draftConfirmation) {
                dispatch(
                  draftDelete({ storageName: "p-general", id: openedDraft })
                );
              }
            }
          } else {
            dispatch(removeUpdatedDoc(_id));
          }
          dispatch(dataSelect(0));
          type = "Success";
          errorThrow(message);
        } else {
          type = "Error";
          errorThrow(message);
        }
      } catch (err) {
        userAlert({ type, message: err.message, time: 5000 });
      }
    }

    const selectedThumbnail = (e) => {
      const file = Array.from(e.target.files);
      file.forEach((img, index) => {
        if (img.size > 409600) {
          alert(`greater than 400kb: ${img.name}`);
          delete file[index];
        }
      });
      if (file.length === 0) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          const value = { thumbId: "", thumbUrl: reader.result };
          if (thumbId) {
            value.oldThumbnailId = thumbId;
          }
          dispatch(
            changeDateKey({
              name: "thumbnail",
              value,
            })
          );
        }
      };

      reader.readAsDataURL(file[0]);
    };

    const updateDoc = (_id) => {
      dispatch(dataSelect(_id));
    };

    const getProduct = (formData) => {
      const key = formData.get("searchKey");
      if (!key) {
        return;
      }
      dispatch(searchProduct({ key, page: 1 }));
    };

    useEffect(() => {
      dispatch(getDrafts("p-general"));
      dispatch(dataSelect(undefined));
    }, []);

    useEffect(() => {
      if (tOfP && requiredData.find((data) => data.category === category)) {
        const keys = ["keyValueD", "aInfo", "certificate"];

        for (let key of keys) {
          const responseData = requireDataSet(key);
          // if (!openedDraft) {
          dispatch(changeDateKey({ name: key, value: responseData }));
          // }
        }
      } else if (category) {
        categorySelect(category, true);
      }
    }, [tOfP, requiredData, _id]);

    useEffect(() => {
      if (loading?.message) {
        setTimeout(() => {
          dispatch(changeStateKey({ name: "loading", value: false }));
        }, loading?.time || 2000);
      }
    }, [loading]);

    const searchDataFilter = (event) => {
      const query = event.target.value?.trim().toLowerCase();
      const filtered = query
        ? searchData.filter((pro) => {
            if (pro.name.toLowerCase().includes(query)) {
              return pro;
            }
          })
        : searchData.slice(0, 7);
      dispatch(changeStateKey({ name: "searchResult", value: filtered }));
    };

    return (
      <Fragment>
        <section className={style.section} id="productUser">
          {loading && !loading?.type && <Wait />}
          {loading?.type && UserAlert(loading)}
          <div className={style.container}>
            <Handler
              Fragment={Fragment}
              Image={Image}
              dispatch={dispatch}
              useSelector={useSelector}
            />
            <div className={style.second}>
              {container == "searchProduct" ? (
                <Fragment>
                  <form className={style.form} action={getProduct}>
                    <h4>
                      Choose Document <span>{numOfSearchResult}</span>
                    </h4>
                    <input
                      type="text"
                      name="searchKey"
                      placeholder="search product name..."
                      onChange={searchDataFilter}
                    />
                    <button type="submit">Search</button>
                  </form>
                  <div className={style.searchProduct}>
                    {numOfSearchResult > 0 ? (
                      searchResult.map((pro, index) => {
                        const { name, _id: docId } = pro;

                        return (
                          docId != _id && (
                            <div key={index}>
                              {name}
                              <p
                                onClick={() => deleteProductFunc(docId, name)}
                                className={style.closeBtn}
                              >
                                <span className={style.one}></span>
                                <span className={style.two}></span>
                              </p>
                              <svg
                                onClick={() => {
                                  updateDoc(docId);
                                }}
                                className={style.updateIcon}
                                x="0px"
                                y="0px"
                                viewBox="0 0 40 40"
                              >
                                <path
                                  fill="#00bfff"
                                  d="M5.982 29.309L8.571 26.719 13.618 31.115 10.715 34.019 2.453 37.547z"
                                ></path>
                                <path
                                  fill="#00bfff"
                                  d="M8.595,27.403l4.291,3.737l-2.457,2.457l-7.026,3.001l3.001-7.003L8.595,27.403 M8.548,26.036 l-2.988,2.988l-4.059,9.474L11,34.44l3.351-3.351L8.548,26.036L8.548,26.036z"
                                ></path>
                                <path
                                  fill="#00bfff"
                                  d="M3.805 33.13L1.504 38.5 6.888 36.201z"
                                ></path>
                                <path
                                  fill="#00bfff"
                                  d="M30.062,5.215L32.3,2.978C32.931,2.347,33.769,2,34.66,2s1.729,0.347,2.36,0.978 c1.302,1.302,1.302,3.419,0,4.721l-2.237,2.237L30.062,5.215z"
                                ></path>
                                <path
                                  fill="#00bfff"
                                  d="M34.66,2.5c0.758,0,1.471,0.295,2.007,0.831c1.107,1.107,1.107,2.907,0,4.014l-1.884,1.884 L30.77,5.215l1.884-1.884C33.189,2.795,33.902,2.5,34.66,2.5 M34.66,1.5c-0.982,0-1.965,0.375-2.714,1.124l-2.591,2.591 l5.428,5.428l2.591-2.591c1.499-1.499,1.499-3.929,0-5.428v0C36.625,1.875,35.643,1.5,34.66,1.5L34.66,1.5z"
                                ></path>
                                <g>
                                  <path
                                    fill="#00FFFF"
                                    d="M11.346,33.388c-0.066-0.153-0.157-0.308-0.282-0.454c-0.31-0.363-0.749-0.584-1.31-0.661 c-0.2-1.267-1.206-1.803-1.989-1.964c-0.132-0.864-0.649-1.342-1.201-1.582l21.49-21.503l4.721,4.721L11.346,33.388z"
                                  ></path>
                                  <path
                                    fill="#4788c7"
                                    d="M28.054,7.931l4.014,4.014L11.431,32.594c-0.242-0.278-0.638-0.59-1.261-0.748 c-0.306-1.078-1.155-1.685-1.983-1.943c-0.151-0.546-0.447-0.968-0.821-1.272L28.054,7.931 M28.053,6.517L5.56,29.023 c0,0,0.007,0,0.021,0c0.197,0,1.715,0.054,1.715,1.731c0,0,1.993,0.062,1.993,1.99c1.982,0,1.71,1.697,1.71,1.697l22.482-22.495 L28.053,6.517L28.053,6.517z"
                                  ></path>
                                </g>
                                <g>
                                  <path
                                    fill="#Ffff00"
                                    d="M29.107 4.764H34.685V11.440999999999999H29.107z"
                                    transform="rotate(-45.009 31.895 8.103)"
                                  ></path>
                                  <path
                                    fill="#Ffff00"
                                    d="M31.507,4.477l4.014,4.014l-3.237,3.237L28.27,7.714L31.507,4.477 M31.507,3.063l-4.651,4.651 l5.428,5.428l4.651-4.651L31.507,3.063L31.507,3.063z"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                          )
                        );
                      })
                    ) : (
                      <span>Not result </span>
                    )}
                    {searchPage > 0 ? (
                      <button
                        onClick={() => {
                          dispatch(
                            searchProduct({ key: searchKey, page: searchPage })
                          );
                        }}
                        type="button"
                      >
                        More
                      </button>
                    ) : null}
                  </div>
                </Fragment>
              ) : null}
              {container == "Thumbnail" ? (
                <div className={style.thumbnail}>
                  {thumbUrl ? (
                    <Image
                      alt="thumbnail"
                      src={thumbUrl}
                      height={300}
                      width={300}
                    />
                  ) : null}
                  <label htmlFor="thumbnail">
                    {thumbUrl ? "Change" : "Choose"} Thumbnail
                  </label>
                  <input
                    className={style.inputImages}
                    onChange={selectedThumbnail}
                    name="thumbnail"
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                  />
                </div>
              ) : null}
              {container == "Type" ? (
                <Fragment>
                  <label htmlFor="name">Name</label>
                  <input
                    defaultValue={name}
                    className={style.nameInput}
                    onChange={changeValue}
                    name="name"
                    id="name"
                    type="text"
                    placeholder="enter product name..."
                    maxLength={75}
                  />
                  <label className={style.firstDes} htmlFor="des1">
                    First Description
                  </label>
                  <input
                    defaultValue={des1}
                    className={style.nameInput}
                    onChange={changeValue}
                    name="des1"
                    id="des1"
                    type="text"
                    placeholder="enter first description..."
                    maxLength={45}
                  />
                  <label className={style.mainDes} htmlFor="des2">
                    Second Description
                  </label>
                  <input
                    defaultValue={des2}
                    className={style.nameInput}
                    onChange={changeValue}
                    name="des2"
                    id="des2"
                    type="text"
                    placeholder="enter second description..."
                    maxLength={45}
                  />
                  <label className={style.mainDes} htmlFor="des3">
                    Third Description
                  </label>
                  <input
                    defaultValue={des3}
                    className={style.nameInput}
                    onChange={changeValue}
                    name="des3"
                    id="des3"
                    type="text"
                    placeholder="enter third description..."
                    maxLength={45}
                  />
                  <Options
                    data={categories}
                    name="category"
                    searchOption={searchOption}
                    categorySelect={categorySelect}
                    changeValue={changeValue}
                    selected={category}
                    optFiltered={optFiltered}
                    text="Category"
                  />
                  {category ? (
                    <Options
                      data={tOfPS}
                      name="tOfP"
                      searchOption={searchOption}
                      changeValue={changeValue}
                      selected={tOfP}
                      optFiltered={optFiltered}
                      text="Type Of Product"
                    />
                  ) : null}
                  {category ? (
                    <Options
                      data={brands}
                      name="brand"
                      searchOption={searchOption}
                      changeValue={changeValue}
                      selected={brand}
                      optFiltered={optFiltered}
                      text="Brand"
                    />
                  ) : null}
                </Fragment>
              ) : null}
              {container === "Description" ? (
                <Fragment>
                  <label className={style.descriptionLabel} htmlFor="keyValueD">
                    Key Value Description
                  </label>
                  {renderComponent === "keyValueD" ? null : (
                    <div className={style.keyValues}>
                      {keyValueD.map((data, index) => {
                        return (
                          <KeyValue
                            key={index}
                            useState={useState}
                            keyData={Object.keys(data)[0]}
                            useRef={useRef}
                            valueData={Object.values(data)[0]}
                            descriptionDataSet={descriptionDataSet}
                            descriptionDelete={descriptionDelete}
                            name={`keyValueD`}
                          />
                        );
                      })}
                    </div>
                  )}
                  <label
                    className={style.descriptionLabel}
                    htmlFor="additional"
                  >
                    Description
                  </label>
                  {renderComponent === "description" ? null : (
                    <div className={style.description}>
                      {description.map((data, index) => (
                        <Description
                          key={index}
                          description={data}
                          useState={useState}
                          useRef={useRef}
                          descriptionDataSet={descriptionDataSet}
                          descriptionDelete={descriptionDelete}
                          name={`description`}
                        />
                      ))}
                    </div>
                  )}

                  <label
                    className={style.descriptionLabel}
                    htmlFor="additional"
                  >
                    Additional Information
                  </label>
                  {renderComponent === "aInfo" ? null : (
                    <div className={style.keyValues}>
                      {aInfo.map((data, index) => (
                        <KeyValue
                          key={index}
                          useState={useState}
                          keyData={Object.keys(data)[0]}
                          valueData={Object.values(data)[0]}
                          useRef={useRef}
                          descriptionDataSet={descriptionDataSet}
                          descriptionDelete={descriptionDelete}
                          name={"aInfo"}
                        />
                      ))}
                    </div>
                  )}
                </Fragment>
              ) : null}

              {container === "Image" ? (
                <CrateImagesSets
                  Image={Image}
                  useState={useState}
                  dispatch={dispatch}
                  useEffect={useEffect}
                  useSelector={useSelector}
                  changeValue={changeValue}
                  useRef={useRef}
                  changeDateKey={changeDateKey}
                  changeStateKey={changeStateKey}
                  warningAlert={warningAlert}
                />
              ) : null}
              {container === "Image-Update" ? (
                <UpdateImageSet
                  Image={Image}
                  useState={useState}
                  dispatch={dispatch}
                  useEffect={useEffect}
                  changeDateKey={changeDateKey}
                  useSelector={useSelector}
                  warningAlert={warningAlert}
                />
              ) : null}

              {container === "Variant" ? (
                <VariantSets
                  Image={Image}
                  useRef={useRef}
                  useState={useState}
                  dispatch={dispatch}
                  changeValue={changeValue}
                  useSelector={useSelector}
                  warningAlert={warningAlert}
                />
              ) : null}

              {container === "Variant-Update" ? (
                <UpdateVariant
                  Image={Image}
                  useState={useState}
                  dispatch={dispatch}
                  useRef={useRef}
                  variants={variants}
                  imageSets={imageSets}
                />
              ) : null}

              {container === "Certificate" ? (
                <Certificates
                  Image={Image}
                  certificate={certificate}
                  useState={useState}
                  dispatch={dispatch}
                  useRef={useRef}
                  requiredCertificate={requiredCertificate}
                />
              ) : null}
              {container === "Price&Stock" ? (
                <PriceAndStock
                  useState={useState}
                  dispatch={dispatch}
                  useRef={useRef}
                  useSelector={useSelector}
                  Image={Image}
                  warningAlert={warningAlert}
                  useEffect={useEffect}
                  allStates={allStates}
                  useMemo={useMemo}
                />
              ) : null}

              <button
                onClick={updateCreate}
                className={style.submitBtn}
                type="button"
              >
                {_id ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </section>
      </Fragment>
    );
  } catch (err) {}
};
export default NewProductComponent;
