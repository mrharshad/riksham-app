"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import style from "./buy.module.css";
import { useDispatch, useSelector } from "react-redux";
import { proOrderResult, userKeyChange } from "@/app/redux/slice/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
const BuyNow = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    token,
    data,
    loadingCart,
    total = {},
    selectedLocation = 0,
  } = useSelector((obj) => obj.user);

  const { numOfCartP, cartPro, fName, lName, location, mobileNo, email } = data;
  const defaultOpt = {};
  const [orderOpt, setOrderOpt] = useState(defaultOpt);
  const { openBox, tofPay = "", oneTime } = orderOpt;
  const { address, pinCode, state, district, numOfLocation, area } =
    useMemo(() => {
      return {
        ...location[selectedLocation || 0],
        numOfLocation: location.length,
      };
    }, [selectedLocation]);
  const { newTotal, outOfStocks } = useMemo(() => {
    const outOfStocks = [];
    const newTotal = { items: 0, current: 0, mrp: 0, tOfP: 0 };
    cartPro.forEach(({ _id, qty, mrp, discount }) => {
      if (qty == 0) {
        outOfStocks.push(`cp${_id}`);
      } else if (qty > 0) {
        newTotal.mrp += mrp * qty;
        newTotal.items += qty;
        newTotal.current += (mrp - mrp * (discount.dis / 100)) * qty;
        newTotal.tOfP += 1;
      }
    });
    return { outOfStocks, newTotal };
  }, [cartPro]);

  const changeStyle = (name, value) => {
    for (let id of outOfStocks) {
      const element = document.getElementById(id);
      if (element) element.style[name] = value;
    }
  };
  // window.addEventListener("popstate", () => {});
  useEffect(() => {
    if (loadingCart == undefined) {
      if (newTotal.items !== total?.items)
        dispatch(userKeyChange({ name: "total", value: newTotal }));
      changeStyle("opacity", 0);
      setTimeout(() => {
        changeStyle("display", "none");
      }, 1000);
    }
  }, [cartPro]);
  useEffect(
    () => () => {
      changeStyle("display", "grid");
      changeStyle("opacity", 10);
    },
    []
  );
  const openBoxSet = (value) =>
    setOrderOpt(Object.assign({ ...orderOpt, openBox: value }));
  const oneTimeSet = (value) =>
    setOrderOpt(Object.assign({ ...orderOpt, oneTime: value }));
  const tOfPSet = (value) =>
    setOrderOpt(Object.assign({ ...orderOpt, tofPay: value }));

  const discount = ((total.mrp - total.current) / total.mrp) * 100;
  const createOrder = async () => {
    dispatch(userKeyChange({ name: "uSOS", value: true }));
    const request = await fetch("/api/admin/user/product/order-create", {
      method: "PUT",
      body: JSON.stringify({
        token,
        userCartPro: cartPro,
        address,
        area,
        state,
        pinCode,
        district,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();
    dispatch(proOrderResult(response));
    if (response.success) setTimeout(() => router.replace("/"), 2000);
  };

  return total.tOfP == 0 && !loadingCart ? (
    <p className={style.noStock}>Product out of stock</p>
  ) : (
    <div className={style.mainDiv}>
      <p>Delivery Information</p>
      {total.tOfP > 1 && (
        <div id={style.oneTime} className={style.openBox}>
          <p>One time delivery :</p>
          <span
            onClick={() => oneTimeSet(true)}
            style={{ color: oneTime ? "aqua" : "white" }}
          >
            Yes
          </span>
          <span
            onClick={() => oneTimeSet(false)}
            style={{ color: !oneTime ? "aqua" : "white" }}
          >
            No
          </span>
          <span>
            Do you want all products at the time of final product delivery?
          </span>
        </div>
      )}
      <div className={style.changeLocation}>
        <input type="checkbox" name="changeLocation" id="changeLocation" />

        <div className={style.openBox}>
          <p>Open Box :</p>
          <span
            onClick={() => openBoxSet(true)}
            style={{ color: openBox ? "aqua" : "white" }}
          >
            Yes
          </span>{" "}
          <span
            onClick={() => openBoxSet(false)}
            style={{ color: !openBox ? "aqua" : "white" }}
          >
            No
          </span>
        </div>
        {numOfLocation < 11 && loadingCart == undefined && (
          <>
            <label className={style.toggleLocation} htmlFor="changeLocation">
              Delivery Locations
            </label>
            <div className={style.locations}>
              {location.map(({ address, area, pinCode, _id }, index) => (
                <div
                  key={_id}
                  style={{
                    borderColor:
                      index == selectedLocation ? "deepskyblue" : "gray",
                  }}
                  onClick={() =>
                    dispatch(
                      userKeyChange({
                        name: "selectedLocation",
                        value: index,
                      })
                    )
                  }
                >
                  <p>PinCode: {pinCode}</p>
                  <p>Area: {area}</p>
                  <p>Address: {address}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={style.deliveryInfo}>
        <p>
          Full Name:
          <span>
            {fName} {lName}
          </span>
        </p>
        <p>
          Mobile Number:
          <span>{mobileNo}</span>
        </p>

        <p>
          Email: <span> {email} </span>
        </p>
        <p>
          PinCode: <span> {pinCode} </span>
        </p>
        <p>
          Area: <span> {area} </span>
        </p>
        <p>
          District: <span> {district} </span>
        </p>
        <p>
          State: <span> {state} </span>
        </p>
        <p>
          Address: <span> {address} </span>
        </p>
      </div>
      <p>Payment Option</p>

      <span className={style.condition}>
        By placing your order, you agree to Website's
        <Link href={"/"}>privacy notice</Link>
        and <Link href={"/"}>conditions of use</Link>.
      </span>
      <div className={style.finalAmount}>
        <p>
          Total Amount: <span>₹{total.current?.toLocaleString("en-IN")}</span>
        </p>
        {discount ? (
          <>
            <p>Save:</p>
            <span>₹{(total.mrp - total.current).toLocaleString("en-IN")}</span>
            <span>-{discount.toFixed(2)}%</span>
          </>
        ) : null}
        <p className={style.items}>
          Number Of Items: <span>{total.items}</span>
        </p>
      </div>
      <button
        style={
          tofPay == "Pay on Delivery" || tofPay == ""
            ? null
            : {
                display: "none",
              }
        }
        onClick={() =>
          tOfPSet(tofPay == "Pay on Delivery" ? "" : "Pay on Delivery")
        }
      >
        Pay on Delivery
      </button>
      <div
        className={style.cod}
        style={{ maxHeight: tofPay == "Pay on Delivery" ? "1000px" : "0px" }}
      >
        {!loadingCart && <button onClick={createOrder}>Order Now</button>}
      </div>
      <button
        style={
          tofPay == "PrePaid" || tofPay == ""
            ? null
            : {
                display: "none",
              }
        }
        onClick={() => tOfPSet(tofPay == "PrePaid" ? "" : "PrePaid")}
      >
        PrePayment
      </button>
      <div
        className={style.prePay}
        style={{ maxHeight: tofPay == "PrePaid" ? "1000px" : "0px" }}
      >
        <p>Bank Transfer Instructions: (NO TRANSITION CHARGE)</p>
        <p>Please transfer the pay amount to the following bank account</p>
        <p>BHIM/UPI ID:- riksham.com@ybl</p>
        <p>ACCOUNT HOLDER NAME:- Harshad Sahu</p>
        <p>ACCOUNT NUMBER:- 6127020100007572</p>
        <p>ISFC CODE:- UBIN0561274</p>
        <p>SEND US THE CONFIRMATION / SCREENSHOT WITH THE ORDER ID ON</p>
        <a
          className={style.sendScreenShort1}
          href="mailto:rikshamsahu@gmail.com"
        >
          Mail: <span>rikshamsahu@gmail.com</span>
        </a>
        <a className={style.sendScreenShort2} href="tel:7771998614">
          Whatsapp: <span> 7771998614</span>
        </a>
        <p>FROM YOUR REGISTERED EMAIL OR MOBILE NUMBER.</p>
        <Image
          src={
            "https://res.cloudinary.com/duxuhsx8x/image/upload/v1692605694/SiteImages/gt37boidbanznhpahh6x.png"
          }
          alt="bar code"
          height={150}
          width={150}
        />
      </div>
    </div>
  );
};

export default BuyNow;

// </div>

// <div className={style.typesOfPayment}>
// <p className={style.paymentMethod}>Payment Method</p>

// </div>
// </div>
