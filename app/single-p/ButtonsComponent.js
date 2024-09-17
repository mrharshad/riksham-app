"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import style from "./buttons.module.css";
import { useRouter } from "next/navigation";
import { visitPage } from "../redux/slice/pageHistory";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  addToCartPro,
  dataValueChange,
  userKeyChange,
} from "../redux/slice/user";
function ButtonsComponent({ clientData, tOfP, imageSetD, Link }) {
  const {
    _id,
    variantD,
    imageSets,
    variants,
    varKVD = {},
    category,
  } = clientData;
  const { data, uSos, token, device } = useSelector((data) => data.user);
  const { fName, location, cartPro, numOfCartP } = data || {};
  const { singleP = {} } = useSelector((data) => data.pageHistory);
  const {
    proId,
    tOfPData = [],
    cateData = [],
    fetchKey,
    cateName,
    tOfPName,
  } = singleP;
  const dispatch = useDispatch();
  const router = useRouter();
  const [openedVar, setOpenedVar] = useState(0);
  const [openedOpt, setOpenedOpt] = useState(0);

  const emptyLocation = {
    district: "",
    state: "",
    pinCode: "4920",
    area: "",
  };
  const [pinCodeInfo, setPinCodeInfo] = useState(
    location?.[0] || emptyLocation
  );

  const addedToCart = useMemo(
    () => cartPro?.some((obj) => obj._id == _id),
    [numOfCartP, _id]
  );

  const {
    mrp,
    kVD,
    dis,
    min,
    variantNames,
    optionNames,
    images,
    iSN,
    disOpt,
    stockInfo,
    vD,
  } = useMemo(() => {
    let stockInfo = {
      message: "Check maximum time in delivery",
      stock: (
        <p style={{ color: "green" }} className={style.stock}>
          In-Stock
        </p>
      ),
    };

    const { vD, disOpt, options } =
      variants[variants.length > openedVar ? openedVar : 0];
    const optionNames = options.map(({ optID }) => optID);
    const newOpenedOpt = options.length > openedOpt ? openedOpt : 0;
    const { loc, ...optData } = options[newOpenedOpt];
    let state = 0;
    let district = 0;
    let global = 0;

    loc.forEach((sta) => {
      const { s, d } = sta;
      const stateQty = d.reduce((acc, dis) => {
        const [name, qty] = dis.split(":");
        if (pinCodeInfo.district == name) district = +qty;
        return acc + +qty;
      }, 0);
      if (pinCodeInfo.state === s) state = stateQty;

      global += stateQty;
    });
    const dateFormatter = new Intl.DateTimeFormat("en-In", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const { min, dis } = disOpt[0] || {};
    const oneDay = 5.5 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000;
    const minimumDays = new Date(
      Date.now() + oneDay * (district >= min ? 4 : state >= min ? 8 : 10)
    );
    let maximumDays = new Date(
      Date.now() + oneDay * (district >= min ? 5 : state >= min ? 10 : 14)
    );
    if (min > global)
      stockInfo.stock = <p className={style.stock}>Out Of Stock</p>;
    else if (min > 1)
      stockInfo.minOrder = (
        <p>Orders less than {min} pieces will not be accepted</p>
      );
    if (min < global && min * 6 > global)
      stockInfo.lowStock = (
        <p className={style.lowStock}>
          Only {global} {tOfP} left
        </p>
      );

    let pinCode = new String(pinCodeInfo.pinCode);

    if (pinCode.length === 6)
      stockInfo.message = (
        <p className={style.delivery}>
          Delivered:{" "}
          <span>
            {dateFormatter
              .format(minimumDays)
              .replace(new Date().getFullYear(), "")}
          </span>
          To <span>{dateFormatter.format(maximumDays)}</span>
        </p>
      );
    const kVD = new Array();
    const data = varKVD[vD];
    const loop = data?.length;
    for (let key = 0; key < loop; ) {
      kVD.push(
        <div key={key}>
          <p>{data[key]} :</p>
          <span>{data[key + 1]}</span>
        </div>
      );
      key = key + 2;
    }
    return {
      vD,
      stockInfo,
      optionNames,
      disOpt: disOpt.slice(1),
      kVD,
      min,
      dis,
      ...optData,
      ...imageSets.find((set) => set.iSN === optionNames[newOpenedOpt]),
      variantNames: variants.map((obj) => obj.vD),
    };
  }, [openedOpt, openedVar, pinCodeInfo, _id]);
  const [mainImg, setMainImg] = useState();
  useEffect(() => {
    setMainImg(images[0].url);
  }, [images]);
  const checkDeliveryService = async (pinCode) => {
    const request = await fetch(
      `/api/product-help/delivery-service?pinCode=${pinCode}`
    );
    const result = await request.json();
    dispatch(
      dataValueChange({
        name: "location",
        value: [result],
      })
    );
    setPinCodeInfo(result);
  };
  const pinCodeChange = (event) => {
    const pinCode = new String(event.target.value);
    const valueLength = pinCode.length;
    if (valueLength == 5 || valueLength == 7) {
      setPinCodeInfo(emptyLocation);
    } else if (valueLength === 6) {
      document.getElementById("addToCartBtn").focus();
      checkDeliveryService(pinCode);
    }
  };
  const addToCart = (event) => {
    if (!fName) return router.push("/user/login");
    else if (addedToCart) return;
    else if (numOfCartP === 9)
      return dispatch(
        userKeyChange({
          name: "uSOS",
          value: {
            type: "Warning",
            message: "Cannot add more than 9 products to cart",
            time: 4000,
          },
        })
      );
    event.target.style.backgroundColor = "lightgreen";
    if (addedToCart) return;
    dispatch(addToCartPro({ token, vD, iSN, _id }));
  };
  const newProduct = (obj = {}) => {
    if (proId == _id) {
      dispatch(visitPage({ active: "singleP" }));
    } else {
      dispatch(
        visitPage({
          name: "singleP",
          value: {
            proId: _id,
            cateName: category,
            ...obj,
          },
          active: "singleP",
        })
      );
    }
  };
  useEffect(() => {
    const display = device == "Desktop" ? "flex" : "grid";
    document.getElementById("tOfP").style.display = display;
    document.getElementById("category").style.display = display;
    const query = {
      tOfPPage: 1,
      tOfPData: [],
      tOfPName: tOfP,
      catePage: 1,
      cateData: [],
    };
    if (category && category === cateName) {
      // query.pending = "category";
    }
    if (!proId || tOfPName === tOfP) {
      query.fetchKey = "tOfP";
      query.fetchNow = Math.floor(Math.random() * 1000);
    }

    newProduct(query);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(
              visitPage({
                name: "singleP",
                value: {
                  fetchKey: entry.target.id,
                  fetchNow: Math.floor(Math.random() * 1000),
                },
              })
            );
          }
        });
      },
      {
        // root: document.querySelector("nav"),
        // rootMargin: "100px",
        // threshold: 0,
      }
    );
    const tOfPElement = document.querySelector(`#tOfP`);
    const categoryElement = document.querySelector("#category");
    observer.observe(tOfPElement);
    observer.observe(categoryElement);
    return () => {
      observer.disconnect();
      dispatch(visitPage({ active: "other" }));
    };
  }, [_id]);

  const convertedURL = (text) => {
    return text.replace(/ /g, "-");
    // .replace(/[^\w-]+/g, "");
  };
  const product = ({
    _id,
    name,
    des1,
    des2,
    des3,
    rating,
    sold,
    imageSetD,
    imgSetPD,
    variants,
    thumbnail,
  }) => {
    const { options, disOpt } = variants[0];
    const dis = disOpt[0].dis;
    const mrp = options[0].mrp;
    return (
      <Link
        className={style.single}
        prefetch={false}
        key={_id}
        href={`/single-p/?_id=${_id}&k=${convertedURL(name)}`}
      >
        <div className={style.ratingReviews}>
          <p className={style.review}>Sold: {sold}</p>

          <p className={style.rating}>
            <span style={{ width: `${rating * 20.2}%` }}>★ ★ ★ ★ ★</span>★ ★ ★ ★
            ★
          </p>
        </div>

        <p className={style.name}>{name}</p>
        <div className={style.imgCover}>
          <Image
            className={style.img}
            src={thumbnail.thumbUrl}
            height={20}
            width={200}
            alt="product image"
          />
        </div>

        <div className={style.priceDiv}>
          <p className={style.charges}>
            Free <span>Shipping</span>
          </p>

          <p className={style.currentPrice}>
            <span>₹</span>
            {(dis ? (mrp - mrp * (dis / 100)).toFixed() : mrp).toLocaleString(
              "en-IN"
            )}
          </p>
          {dis > 0 && (
            <>
              <p className={style.mrp}>
                M.R.P: ₹<span>{mrp.toLocaleString("en-IN")}</span>
              </p>
              <p className={style.discount}>{dis}% Off</p>
            </>
          )}
        </div>
        <div className={style.descriptions}>
          {!imgSetPD && imageSetD ? (
            <p className={style.priceSame}>
              Price of all
              <span> {imageSetD}</span> is same
            </p>
          ) : (
            <p>{des1}</p>
          )}
          <p>{des2}</p>
          <p>{des3}</p>
        </div>
      </Link>
    );
  };
  return (
    <Fragment>
      <div className={style.imgContainer}>
        {mainImg ? (
          <Image
            className={style.mainImg}
            height={400}
            width={400}
            alt="product image"
            src={mainImg}
          />
        ) : null}

        <div className={style.images}>
          {images.map((img, index) => (
            <div key={index} className={style.imagesCover}>
              <Image
                onClick={() => setMainImg(img.url)}
                height={100}
                width={130}
                alt="product image"
                src={img.url}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={style.thirdDiv}>
        <p className={style.free}>Free Delivery</p>
        <button
          id="addToCartBtn"
          style={{
            backgroundColor: addedToCart ? "lightgreen" : "revert-layer",
          }}
          onClick={addToCart}
          className={style.addToCart}
          type="button"
        >
          Add to Cart
        </button>
        <div className={style.pinCode}>
          {!fName && (
            <input
              onChange={pinCodeChange}
              placeholder="pincode"
              type="number"
              name="pinCode"
              id="pinCode"
              defaultValue={Number(pinCodeInfo.pinCode)}
            />
          )}

          {stockInfo.message}
        </div>
      </div>
      <div id={style.similarPro} className={style.products}>
        {tOfPData.length > 0 && <p> Similar Products</p>}
        <div>
          {tOfPData.map(product)}
          <div id="tOfP" className={style.single}>
            <div className={style.ratingReviews}></div>
            <p className={style.name}></p>
            <div className={style.imgCover}></div>

            <div className={style.descriptions}>
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
      </div>

      <div id={style.relatedPro} className={style.products}>
        {cateData.length > 0 && <p> Related Product</p>}
        <div>
          {cateData.map(product)}
          <div id="category" className={style.single}>
            <div className={style.ratingReviews}></div>
            <p className={style.name}></p>
            <div className={style.imgCover}></div>

            <div className={style.descriptions}>
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
      </div>

      <div className={style.secondDiv}>
        <div>
          {stockInfo.stock} {stockInfo.lowStock}
        </div>
        <div className={style.price}>
          <p className={style.current}>
            <span> ₹</span>
            {dis ? (mrp - mrp * (dis / 100)).toFixed() : mrp}
          </p>
          {dis ? (
            <>
              <p className={style.sDiscount}>-{dis}%</p>
              <p className={style.sMrp}>
                M.R.P: <span>₹{mrp}</span>
              </p>
            </>
          ) : null}
        </div>

        {stockInfo.minOrder}
        <div className={style.allOptions}>
          {variantD && (
            <div className={style.options}>
              <p>{variantD}</p>
              <div>
                {variantNames.map((opt, index) => (
                  <span
                    style={
                      index === openedVar
                        ? {
                            backgroundColor: "white",
                            border: "1px solid",
                          }
                        : null
                    }
                    key={index}
                    onClick={() => {
                      const optLength = variants[index].options.length;
                      if (optLength < openedOpt + 1) {
                        setOpenedOpt(optLength - 1);
                      }
                      setOpenedVar(index);
                    }}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {imageSetD && (
            <div className={style.options}>
              <p>{imageSetD}</p>
              {optionNames.map((opt, index) => (
                <span
                  style={
                    index === openedOpt
                      ? {
                          backgroundColor: "white",
                          border: "1px solid",
                        }
                      : null
                  }
                  key={index}
                  onClick={() => setOpenedOpt(index)}
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
          {disOpt.length > 0 && (
            <div id={style.discounts} className={style.options}>
              <p>Quantity Discount</p>
              <div>
                {disOpt.map(({ min, dis }, index) => (
                  <span key={index}>
                    {" "}
                    {min} : -{dis}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {kVD.length > 0 && <div className={style.kVD}>{kVD}</div>}
      </div>
    </Fragment>
  );
}
export default ButtonsComponent;
