import React from "react";
import style from "./priceAndStock.module.css";

import {
  changeDateKey,
  changeStateKey,
  findDistricts,
  manageDiscountOption,
  updatePrice,
  updateStock,
} from "@/app/redux/slice/manager";
const PriceAndStock = ({
  useState,
  useRef,
  dispatch,
  useSelector,
  Image,
  useEffect,
  warningAlert,
  allStates,
  useMemo,
}) => {
  try {
    const { data, selectedState, fetchedDistricts, loading } = useSelector(
      (data) => data.manager
    );
    const { imgSetPD, variantD, variants, imageSetD, imageSets } = data;
    const { state, districts } = selectedState;
    const [variantIndex, setVariantIndex] = useState(0);

    const [discountIndex, setDiscountIndex] = useState(0);

    const [optIndex, setOptIndex] = useState(false);
    const openedColor = useMemo(() => {
      if (typeof optIndex === "number") {
        return variants[variantIndex].options[optIndex].optID;
      }
    }, [optIndex]);

    const [newLocated, setNewLocated] = useState([]);
    const { vD, options, disOpt } = variants[variantIndex] ?? variants[0];

    const dis = disOpt[discountIndex]?.dis;
    const districtInput = useRef();
    const stockInput = useRef();
    function closeColorStocks() {
      if (typeof optIndex == "number") {
        setOptIndex(false);
      }
    }

    const priceChanges = (event) => {
      let { name, value } = event.target;
      const [key, optIndex] = name.split(":");
      if ((key == "purchased" && value > 300) || value < 0) {
        event.target.value = 0;
        return;
      }
      if (value == "") {
        return;
      }
      dispatch(updatePrice({ variantIndex, optIndex, key, value }));
    };

    const createStoreStockFunc = (event) => {
      const stockInputValue = +stockInput.current.value;

      if (stockInputValue < 1) {
        return warningAlert("Can't give less than 1 stock");
      }
      const districtInputValue = districtInput.current.value;
      if (newLocated.length > 0) {
        let findState = false;
        let findDistrict = false;
        const copyData = JSON.parse(JSON.stringify(newLocated));
        newLocated.forEach((staObj, staIndex) => {
          const { s, d } = staObj;
          if (s === state) {
            findState = staIndex;
          }
          d.forEach((district) => {
            const [dis, qty] = district.split(":");
            if (dis === districtInputValue) {
              findDistrict = true;
            }
          });
        });
        if (findDistrict) {
          return warningAlert(
            `Stock available in -${districtInputValue}- district shop`
          );
        }
        if (findState !== false && !findDistrict) {
          copyData[findState].d.push(
            `${districtInputValue}:${stockInputValue}`
          );
        } else {
          copyData.push({
            s: state,
            d: [`${districtInputValue}:${stockInputValue}`],
          });
        }

        setNewLocated(copyData);
      } else {
        setNewLocated([
          {
            s: state,
            d: [`${districtInputValue}:${stockInputValue}`],
          },
        ]);
      }
    };

    const stockChangeFunc = (event) => {
      const { name, value } = event.target;
      const inputValue = +value;
      if (inputValue <= 0) {
        event.target.value = 1;
        return warningAlert("Can't give less than 1 stock");
      }
      const [stateIndex, districtIndex] = name.split(":");

      const copyData = JSON.parse(JSON.stringify(newLocated));
      const [district] = copyData[stateIndex].d[districtIndex].split(":");
      copyData[stateIndex].d[districtIndex] = `${district}:${inputValue}`;
      setNewLocated(copyData);
    };

    const findDistrictsFunc = (state) => {
      const districts = fetchedDistricts.find(
        (data) => data.state === state
      )?.districts;
      if (districts) {
        dispatch(
          changeStateKey({ name: "selectedState", value: { state, districts } })
        );
      } else {
        dispatch(findDistricts(state));
      }
    };
    const selectedStateFunc = (event) => {
      const value = event.target.value;
      findDistrictsFunc(value);
    };

    const deleteStateStock = (stateIndex) => {
      if (newLocated.length == 1) {
        return warningAlert("Create another district or state first");
      }
      setNewLocated((previous) =>
        previous.filter((stateObj, index) => index !== stateIndex)
      );
    };
    const deleteDistrictStock = (stateIndex, districtIndex) => {
      let districts = newLocated[stateIndex].d;
      if (districts.length === 1) {
        deleteStateStock(stateIndex);
      } else {
        newLocated[stateIndex].d = districts.filter(
          (district, index) => index !== districtIndex
        );
        setNewLocated([...newLocated]);
      }
    };

    useEffect(() => {
      if (!districts.length) {
        findDistrictsFunc(state);
      }
    }, []);

    const addDiscountOptionFunc = (formData) => {
      const dis = formData.get("dis");
      const min = formData.get("min");
      dispatch(
        manageDiscountOption({
          variantIndex,
          newData: { min: +min, dis: +dis },
        })
      );
    };
    const changeDiscountOptValue = (newData, disOptIndex) => {
      dispatch(manageDiscountOption({ variantIndex, newData, disOptIndex }));
    };
    const deleteDiscountOpt = (disOptIndex) => {
      if (disOptIndex == disOpt.length - 1) {
        setTimeout(() => {
          setDiscountIndex(0);
        }, 100);
      }
      dispatch(manageDiscountOption({ variantIndex, disOptIndex }));
    };
    return (
      <div className={style.mainDiv}>
        <p>Manage ( Price & Stock ) </p>

        {imageSetD && (
          <label className={style.everyProduct}>
            The difference in prices for all the {imageSetD} of the product is -
            <button
              style={{
                backgroundColor: imgSetPD ? "rgb(12, 255, 12)" : "red",
              }}
              onClick={() => {
                dispatch(
                  changeDateKey({
                    name: "imgSetPD",
                    value: !imgSetPD,
                  })
                );
              }}
            ></button>
          </label>
        )}
        {typeof variantIndex === "number" ? (
          <div className={style.variantInfo}>
            <p>
              Update - {variantD || null}:<span>{vD || null}</span>
            </p>

            <div id={style.discounts} className={style.variantUpdate}>
              {disOpt.map((opt, index) => (
                <div
                  style={{
                    borderColor:
                      discountIndex == index ? "rgb(12, 255, 12)" : "white",
                  }}
                  key={opt.min}
                  onClick={() => {
                    if (discountIndex !== index) {
                      setDiscountIndex(index);
                    }
                  }}
                >
                  <div>
                    <span>{index + 1}</span>
                    {disOpt.length > 1 && (
                      <p
                        onClick={() => deleteDiscountOpt(index)}
                        className={style.closeBtn}
                      >
                        <span className={style.one}></span>
                        <span className={style.two}></span>
                      </p>
                    )}
                  </div>
                  <label htmlFor="changeMin">
                    Minimum Qty:
                    <input
                      defaultValue={opt.min}
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value > 999) {
                          e.target.value = 1;
                        } else if (value == "" || value < 1) {
                          return;
                        } else {
                          changeDiscountOptValue(
                            { min: +e.target.value, dis: opt.dis },
                            index
                          );
                        }
                      }}
                    />
                  </label>
                  <label htmlFor="changeDis">
                    Discount - On (%):
                    <input
                      defaultValue={opt.dis}
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value < 0 || value > 70) {
                          e.target.value = 0;
                        } else if (value == "") {
                          return;
                        } else {
                          changeDiscountOptValue(
                            { dis: +e.target.value, min: opt.min },
                            index
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
            <form
              action={addDiscountOptionFunc}
              className={style.manageDiscount}
            >
              <label htmlFor="min">
                Minimum Qty:
                <input
                  defaultValue={10}
                  type="number"
                  name="min"
                  id="min"
                  min={1}
                  max={999}
                />
              </label>
              <label htmlFor="dis">
                Discount - On (%):
                <input
                  defaultValue={5}
                  type="number"
                  name="dis"
                  id="dis"
                  min={2}
                  max={70}
                />{" "}
              </label>
              <button type="submit">Add Option</button>
            </form>
            {variantIndex != null && (
              <div className={style.variantUpdate}>
                {options.map((obj, index) => {
                  const { optID, mrp, purchased, loc } = obj;
                  const firstImgUrl = imageSets.find((obj) => obj.iSN === optID)
                    .images[0].url;
                  const show = imgSetPD || index == 0;
                  return (
                    <div
                      style={{
                        borderColor:
                          optIndex === index ? "rgb(12, 255, 12)" : "white",
                      }}
                      onClick={(even) =>
                        setOptIndex((previous) => {
                          if (previous === index) {
                            return false;
                          } else {
                            if (newLocated) {
                              setNewLocated([]);
                            }

                            setTimeout(() => setNewLocated(loc), 1);

                            return index;
                          }
                        })
                      }
                      key={index}
                      className={style.variantColor}
                    >
                      <Image
                        className={style.img}
                        src={firstImgUrl}
                        alt="product color image"
                        height={150}
                        width={150}
                      />
                      <p className={style.colorName}>
                        {optID}
                        {show && (
                          <span>
                            &#2352; {(mrp - mrp * (dis / 100)).toFixed()}
                          </span>
                        )}{" "}
                      </p>
                      {show && (
                        <div className={style.prices}>
                          <label>
                            Price:
                            <input
                              defaultValue={mrp}
                              onChange={priceChanges}
                              name={`mrp:${index}`}
                              type="number"
                            />
                          </label>
                          <label>
                            Purchased (%):
                            <input
                              defaultValue={purchased}
                              onChange={priceChanges}
                              name={`purchased:${index}`}
                              type="number"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {typeof optIndex === "number" && newLocated.length && (
              <div className={style.stockManage}>
                <p className={style.colorName}>
                  Manage Stock - <span> {openedColor} </span>
                </p>
                <div>
                  {newLocated.map((states, stateIndex) => {
                    const { s, d } = states;
                    return (
                      <div className={style.state} key={s}>
                        <div>
                          <p className={style.stateName}>State: {s} </p>
                          <p
                            onClick={() => deleteStateStock(stateIndex)}
                            className={style.closeBtn}
                          >
                            <span className={style.one}></span>
                            <span className={style.two}></span>
                          </p>
                        </div>
                        {d.map((district, districtIndex) => {
                          const [dN, qty] = district.split(":");
                          return (
                            <div className={style.district} key={dN}>
                              <span>{dN}</span>
                              <input
                                name={`${stateIndex}:${districtIndex}`}
                                onChange={stockChangeFunc}
                                className={style.stock}
                                type="number"
                                defaultValue={qty}
                              />
                              <p
                                onClick={() =>
                                  deleteDistrictStock(stateIndex, districtIndex)
                                }
                                className={style.closeBtn}
                              >
                                <span className={style.one}></span>
                                <span className={style.two}></span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className={style.newStoreStock}>
                  <select
                    defaultValue={state}
                    onChange={selectedStateFunc}
                    className={style.selectState}
                  >
                    {allStates.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <select ref={districtInput} className={style.selectDistrict}>
                    {districts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="stock..."
                    ref={stockInput}
                    min={1}
                    defaultValue={1}
                  />
                  <button onClick={createStoreStockFunc} type="button">
                    Create
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (newLocated.length === 0) {
                      return warningAlert(
                        "Must have stores in at least 1 district"
                      );
                    }

                    dispatch(
                      updateStock({
                        variantIndex,
                        optIndex,
                        newLocated,
                      })
                    );
                    closeColorStocks();
                    setNewLocated();
                  }}
                  className={style.updateStockBtn}
                >
                  Update Stocks
                </button>
              </div>
            )}
          </div>
        ) : null}
        {variantD && (
          <div className={style.createdVariants}>
            {variants.map(({ vD }, index) => (
              <span
                onClick={() => {
                  if (variantIndex !== index) {
                    setVariantIndex(null);
                    setTimeout(() => {
                      setVariantIndex(index);
                      if (optIndex !== null) {
                        setOptIndex(null);
                      }
                      setDiscountIndex(0);
                    }, 100);
                  }
                }}
                style={{
                  backgroundColor:
                    variantIndex == index ? "white" : "lightslategray",
                }}
                key={vD}
              >
                {vD}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {}
};

export default PriceAndStock;
