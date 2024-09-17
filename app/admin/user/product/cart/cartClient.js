"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import style from "./layout..module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cartProLoading,
  cartProductSet,
  deleteCartPro,
  userKeyChange,
} from "@/app/redux/slice/user";
import { addSingleProduct } from "@/app/redux/slice/activity";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CartClient = ({ children }) => {
  const router = useRouter();
  const { products } = useSelector((obj) => obj.activity);
  const dispatch = useDispatch();
  const { data, device, loadingCart, selectedLocation } = useSelector(
    (obj) => obj.user
  );

  const { numOfCartP, cartPro, fName, location, uSOS } = data || {};
  const empty = () => (
    <section className={style.section} id="productUser">
      <p className={style.empty}>Cart is empty</p>
    </section>
  );
  if (!fName || !numOfCartP) {
    return empty();
  }
  const { district, state } = useMemo(() => {
    return location[selectedLocation || 0];
  }, [selectedLocation]);

  const deleteCartProduct = (_id, clicked) => {
    if (!clicked || numOfCartP == 1) router.push("/");
    dispatch(cartProLoading(_id));
    dispatch(deleteCartPro(_id));
  };

  const deliveryTime = (loc, qty, disOpt) => {
    const dateFormatter = new Intl.DateTimeFormat("en-In", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let dQty = 0;
    let sQty = 0;
    let gQty = 0;
    loc.forEach((sta) => {
      const { s, d } = sta;
      const stateQty = d.reduce((acc, dis) => {
        const [name, qty] = dis.split(":");
        if (district == name) dQty = +qty;
        return acc + +qty;
      }, 0);
      if (state === s) sQty = stateQty;
      gQty += stateQty;
    });
    const oneDay = 5.5 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000;
    const time = {};
    let minMax = (min, max) => {
      time.minDay = dateFormatter
        .format(new Date(Date.now() + oneDay * min))
        .replace(new Date().getFullYear(), "");
      time.maxDay = dateFormatter.format(new Date(Date.now() + oneDay * max));
    };

    let discount;
    for (let i = 0; i < disOpt.length; i++) {
      const index = disOpt.length - 1 - i;

      if (disOpt[index].min <= qty) {
        discount = disOpt[index];
        break;
      }
    }
    dQty >= qty ? minMax(4, 5) : sQty >= qty ? minMax(8, 10) : minMax(10, 14);

    return {
      ...time,
      gQty,
      discount,
      qty: qty <= gQty ? qty : 0,
    };
  };

  const findOption = (newObj, data) => {
    const { _id, vD, iSN, index } = newObj;
    const { variants, imageSets, ...newData } = data;
    const { disOpt, options } = variants.find((obj) => obj.vD == vD) || {};
    const thumbnail = imageSets.find((obj) => obj.iSN == iSN);
    if (!disOpt || !thumbnail) {
      return deleteCartProduct(_id);
    }

    const { mrp, loc } = options.find((obj) => obj.optID == iSN) || {};
    if (!mrp) {
      return deleteCartProduct(_id);
    }
    dispatch(
      cartProductSet({
        index,
        data: {
          _id,
          vD,
          iSN,
          loc,
          mrp,
          disOpt,
          ...newData,
          ...deliveryTime(loc, disOpt[0].min, disOpt),
          thumbnail: thumbnail.images[0].url,
        },
      })
    );
  };

  const findProduct = async (newObj) => {
    const _id = newObj._id;
    dispatch(cartProLoading(_id));
    const request = await fetch(`/api/product/single-p/${_id}`);
    const { success, data } = await request.json();
    if (success) {
      findOption(newObj, data);

      dispatch(addSingleProduct({ data, _id }));
    } else {
      deleteCartProduct(_id);
    }
  };
  const qtyChange = (index, value, cpId) => {
    const data = cartPro[index];
    dispatch(
      cartProductSet({
        index,
        data: {
          ...data,
          ...deliveryTime(
            data.loc,
            value ||
              +document.getElementById(cpId).querySelector("input").value,
            data.disOpt
          ),
        },
      })
    );
  };
  const changeDistrict = (loc, qty, disOpt, index) => {
    dispatch(
      cartProductSet({
        index,
        data: { ...cartPro[index], ...deliveryTime(loc, qty, disOpt) },
      })
    );
  };
  useEffect(() => {
    cartPro.forEach((cart, index) => {
      const { _id, mrp, loc, qty, disOpt } = cart;
      const find = !mrp && products.find((obj) => obj._id === _id);
      if (find) findOption({ ...cart, index }, find);
      else if (!mrp) {
        findProduct({ ...cart, index });
      } else changeDistrict(loc, qty, disOpt, index);
    });

    return () => {
      if (loadingCart)
        dispatch(userKeyChange({ name: "loadingCart", value: undefined }));
    };
  }, [district]);
  const qtyOpt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const convertedURL = (text) => {
    return text.replace(/ /g, "-");
  };
  const qtyOptElement = (num) => (
    <option key={num} value={num}>
      {num}
    </option>
  );

  return (
    <>
      <h1 className={style.h1}>Your Cart Product</h1>
      <div className={style.products}>
        {cartPro.map(
          (
            {
              _id,
              name,
              qty,
              gQty,
              minDay,
              maxDay,
              thumbnail,
              vD,
              iSN,
              mrp,
              variantD,
              imageSetD,
              rating,
              nOfB,
              discount,
              disOpt,
            },
            index
          ) => {
            const { min, dis } = disOpt?.[0] || {};
            const price = (mrp - mrp * (dis / 100))?.toFixed();
            return mrp ? (
              <div className={style.pro} key={`cp${_id}`} id={`cp${_id}`}>
                <div className={style.ratingReviews}>
                  <p className={style.review}>Sold: {nOfB || 0}</p>

                  <p className={style.rating}>
                    <span style={{ width: `${rating * 20.2}%` }}>
                      ★ ★ ★ ★ ★
                    </span>
                    ★ ★ ★ ★ ★
                  </p>
                </div>
                {qty ? (
                  <p className={style.time}>
                    Delivered: <span>{minDay}</span>
                    To <span>{maxDay}</span>
                  </p>
                ) : (
                  <p className={style.outOfStock}>Out Of Stock</p>
                )}
                <p className={style.name}>{name}</p>
                <Link
                  className={style.imgCover}
                  prefetch={false}
                  key={_id}
                  href={`/single-p/?_id=${_id}&k=${convertedURL(name)}`}
                >
                  <Image
                    className={style.img}
                    src={thumbnail}
                    height={20}
                    width={200}
                    alt="product image"
                  />
                </Link>

                <div className={style.priceDiv}>
                  <p className={style.currentPrice}>
                    <span>₹</span>
                    {price.toLocaleString("en-IN")}
                  </p>
                  {discount?.dis ? (
                    <>
                      <p className={style.discount}>-{discount.dis}% Off</p>
                      <p className={style.mrp}>
                        M.R.P: ₹<span>{mrp.toLocaleString("en-IN")}</span>
                      </p>
                    </>
                  ) : null}
                </div>

                <div className={style.qty}>
                  <span>Qty : </span>
                  {qty <= 9 ? (
                    <select
                      onChange={(e) => qtyChange(index, +e.target.value)}
                      defaultValue={qty}
                      className={style.qty}
                    >
                      {qty
                        ? qtyOpt.map(
                            (num) =>
                              min <= num && gQty >= num && qtyOptElement(num)
                          )
                        : qtyOptElement(0)}
                    </select>
                  ) : (
                    <div>
                      <input
                        onChange={(e) => {
                          const value = +e.target.value;
                          const btn = document
                            .getElementById(`cp${_id}`)
                            .querySelector("button");
                          if (
                            value &&
                            value !== qty &&
                            value <= gQty &&
                            min <= value
                          ) {
                            btn.style.display = "unset";
                          } else {
                            btn.style.display = "none";
                          }
                        }}
                        name="inputQty"
                        type="number"
                        defaultValue={qty}
                      />
                      <button
                        onClick={(e) => {
                          e.target.style.display = "none";
                          qtyChange(index, 0, `cp${_id}`);
                        }}
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  <span onClick={() => deleteCartProduct(_id, true)}>
                    Delete
                  </span>
                </div>
                <div className={style.exDetails}>
                  <div className={style.exFDiv}>
                    {qty > 1 && (
                      <p className={style.total}>
                        <span>Total</span>: ₹
                        {(price * qty).toLocaleString("en-IN")}
                      </p>
                    )}
                    {variantD && (
                      <p>
                        <span> {variantD}</span>: {vD}
                      </p>
                    )}
                    {imageSetD && (
                      <p>
                        <span>{imageSetD}</span>: {iSN}
                      </p>
                    )}
                  </div>
                  <div className={style.exSDiv}>
                    <p>Discount:</p>
                    {disOpt.map(
                      ({ min, dis }) =>
                        dis !== discount && (
                          <span key={dis}>
                            {min} : -{dis}%
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={style.pro} key={`cp${_id}`} id={style.skeleton}>
                <div className={style.ratingReviews}></div>
                <p className={style.name}></p>
                <div className={style.imgCover}></div>
                <p className={style.time}></p>
                <div className={style.priceDiv}> </div>
                <div className={style.qty}> </div>
                <div className={style.exDetails}> </div>
              </div>
            );
          }
        )}
      </div>
      {children}
    </>
  );
};

export default CartClient;
