"use client";
import { Fragment, useRef, useState } from "react";
import style from "./style.module.css";
import Image from "next/image";
const Client = ({ token }) => {
  const [page, setPage] = useState(1);
  const [wait, setWait] = useState(false);
  const [resultProducts, setResultProduct] = useState([]);
  const [productOrder, setProductOrder] = useState();
  const [userDetails, setUserDetails] = useState();
  const [qty, setQuantity] = useState(1);
  const [openColor, setOpenColor] = useState(0);
  const [openVariant, setOpenVariant] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState();
  const inputValue = useRef();
  const userEmailInput = useRef();
  const showReceivedAmount = useRef();
  const resetUseState = () => {
    setProductOrder();
    setUserDetails();
    setSelectedPayment();
    setOpenVariant(0);
    setOpenColor(0);
    setQuantity(1);
    setWait();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const inputCurrentValue = inputValue.current.value.trim();
    if (inputCurrentValue) {
      const productData = await fetch(
        `/api/admin/senior-product-manager/product-find`,
        {
          method: "POST",
          body: JSON.stringify({ keyword: inputCurrentValue, page, token }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const { success, message, products } = await productData.json();
      if (!success) {
        alert(message);
      }
      setResultProduct(products);
    }
  };
  let {
    _id: pId,
    name,
    imageSets,
    tOfP,
    payType,
    variantD,
    variantPD,
    imgSetPD,
    variants,
    shipping,
    packaging,
    everyPC,
    imageSetD,
  } = productOrder || {};

  const { vD, options } = variants?.[openVariant] || {};
  const colorsLength = options?.length;
  const { mrp, current, optID, purchased, loc } =
    options?.[colorsLength > openColor ? openColor : 0] || {};
  const image = imageSets?.find((color) => color.iD === optID).images[0].url;
  const findUser = async () => {
    const value = userEmailInput.current.value;
    if (value.length < 1) {
      return alert("please enter email");
    }
    const productData = await fetch(
      `/api/admin/senior-product-manager/user-find`,
      {
        method: "PUT",
        body: JSON.stringify({ email: value, token }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const { success, message, user } = await productData.json();
    if (success) {
      setUserDetails(user);
    } else {
      alert(message);
    }
  };
  let {
    _id,
    address,
    createdAt,
    state: userState,
    email,
    fName,
    lName,
    mobileNo,
    pinCode,
    district: userDistrict,
  } = userDetails || {};
  let stateStock = 0;
  let districtStock = 0;
  let totalStock = 0;
  if (fName) {
    if (!selectedPayment) {
      setSelectedPayment(payType?.[0]);
    }
    for (let sta of loc) {
      const { s, d } = sta;
      for (let dis of d) {
        const { dN, qty } = dis;
        if (s === userState) {
          stateStock += qty;
        }
        if (dN === userDistrict) {
          districtStock += qty;
        }
        totalStock += qty;
      }
    }
  }

  shipping = shipping || 0;
  packaging = packaging || 0;
  const charges = everyPC ? (shipping + packaging) * qty : shipping + packaging;

  const totalAmount = charges + current * qty;

  const dateFormatter = new Intl.DateTimeFormat("en-In", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  function expectMin(time) {
    const minimumDays = new Date(
      Date.now() +
        5.5 * 60 * 60 * 1000 +
        24 *
          60 *
          60 *
          1000 *
          (time === "district" ? 4 : time === "state" ? 8 : 10)
    );
    return `${dateFormatter.format(minimumDays).slice(0, -4)} `;
  }
  function expectMax(time) {
    const maximumDays = new Date(
      Date.now() +
        5.5 * 60 * 60 * 1000 +
        24 *
          60 *
          60 *
          1000 *
          (time === "district" ? 5 : time === "state" ? 10 : 14)
    );

    return `${dateFormatter.format(maximumDays)}`;
  }

  const expectD =
    qty <= districtStock
      ? `${expectMin("district")}to ${expectMax("district")}`
      : qty <= stateStock
      ? `${expectMin("state")}to ${expectMax("state")}`
      : `${expectMin("country")}to ${expectMax("country")}`;

  const createOrder = async () => {
    setWait(true);
    const order = await fetch(
      `/api/admin/senior-product-manager/create-order`,
      {
        method: "PUT",
        body: JSON.stringify({
          token,
          userId: _id,
          pId,
          qty,
          shipping: everyPC ? shipping * qty : shipping,
          packaging: everyPC ? packaging * qty : packaging,
          mrp: mrp || undefined,
          current,
          address,
          image,
          tOfP,
          pinCode,
          name,
          expectD,
          mNumber: mobileNo,
          vD,
          iD: optID,
          tofPay: selectedPayment,
          state: userState,
          district: userDistrict,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await order.json();
    if (result.success) {
      alert(result.message);
      resetUseState();
    } else {
      setWait(false);
      alert(result.message);
    }
  };
  return (
    <section className={style.mainContainer}>
      <form className={style.searchBar} onSubmit={submitHandler}>
        <input ref={inputValue} placeholder="search..." type="text" />
        <button type="submit">
          <svg viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
              d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#000000"
            ></path>
          </svg>
        </button>
      </form>
      {fName ? (
        <dialog className={style.dialog} ref={showReceivedAmount}>
          <div className={style.container}>
            <p className={style.heading}>
              Select Payment Types:
              <svg
                onClick={() => {
                  showReceivedAmount.current.close();
                }}
                viewBox="0 0 24 24"
                id="Close"
              >
                <g data-name="Layer 2" fill="#FF0000">
                  <g data-name="close" fill="#FF0000">
                    <rect
                      width="24"
                      height="24"
                      opacity="0"
                      transform="rotate(180 12 12)"
                      fill="#FF0000"
                    ></rect>
                    <path
                      d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                      fill="#FF0000"
                    ></path>
                  </g>
                </g>
              </svg>
            </p>

            <div className={style.paymentTypes}>
              {payType.map((type) => (
                <p
                  style={{
                    boxShadow: `inset 0px 0px 3px 0px ${
                      type == selectedPayment ? "rgb(102 242 5" : "white"
                    } `,
                  }}
                  key={type}
                  onClick={() => setSelectedPayment(type)}
                >
                  {type}
                </p>
              ))}
            </div>
            {"Cash on Delivery / Pay on Delivery" !== selectedPayment ? (
              <p className={style.receiverAmo}>
                Received Amount:{" "}
                <span>
                  ₹
                  {(selectedPayment === "Just Delivery / Packaging Charge"
                    ? charges
                    : totalAmount
                  ).toLocaleString("en-IN")}
                </span>
              </p>
            ) : null}

            {wait ? (
              <p className={style.wait}></p>
            ) : (
              <button onClick={createOrder} type="button">
                Create Order
              </button>
            )}
          </div>
        </dialog>
      ) : null}
      <div
        style={{ display: productOrder ? "none" : "grid" }}
        className={style.products}
      >
        {resultProducts.length < 1 ? (
          <p className={style.notFound}>Search Products...</p>
        ) : (
          resultProducts.map((data, index) => {
            const { name } = data;
            return (
              <p
                key={index}
                onClick={() => setProductOrder(data)}
                className={style.name}
              >
                <span>{index + 1}.</span>
                {name}
              </p>
            );
          })
        )}
      </div>
      {productOrder ? (
        <div
          style={{ display: productOrder ? "flex" : "none" }}
          className={style.newOrder}
        >
          <p className={style.heading}>
            Create Order
            <svg
              onClick={() => {
                resetUseState();
              }}
              viewBox="0 0 24 24"
              id="cancel"
            >
              <g data-name="Layer 2">
                <circle cx="12" cy="12" r="10.75" fill="#FF0000"></circle>
                <path
                  fill="#000000"
                  d="M15.5 16.25a.744.744 0 0 1-.53-.22l-7-7a.75.75 0 0 1 1.06-1.06l7 7a.75.75 0 0 1-.53 1.28Z"
                ></path>
                <path
                  fill="#000000"
                  d="M8.5 16.25a.75.75 0 0 1-.53-1.28l7-7a.75.75 0 0 1 1.06 1.06l-7 7a.744.744 0 0 1-.53.22Z"
                ></path>
              </g>
            </svg>
          </p>
          <p className={style.name}>{name}</p>
          <div className={style.imgCover}>
            <Image src={image} height={400} width={400} alt={name} />
          </div>
          <div className={style.variantInfo}>
            <p className={style.charges}>
              <span>Shipping: {shipping ? `₹${shipping}` : "Free"}</span>
              <span>
                Packaging:
                {packaging ? ` ₹${packaging}` : " Free"}
              </span>
            </p>
            <p className={style.shippingCost}>
              {!shipping && !packaging
                ? "You can order any quantity, no charge"
                : shipping || (packaging && everyPC)
                ? "The higher the order quantity, the higher the fee"
                : "Regardless of the quantity of order, there will be no increase in the fee"}
            </p>

            <div className={style.price}>
              <p className={style.current}>
                ₹{current.toLocaleString("en-IN")}
              </p>
              {mrp ? (
                <p className={style.mrp}>
                  M.R.P: <span>₹{mrp.toLocaleString("en-IN")}</span>
                </p>
              ) : null}
            </div>

            <div className={style.colors}>
              {imageSetD}:
              {options.map((color, index) => {
                let { optID, current, loc } = color;
                let colorStock = 0;
                loc.forEach((state) => {
                  state.d.forEach((d) => (colorStock += d.qty));
                });

                current = <p> ₹{current?.toLocaleString("en-IN")}</p>;
                return (
                  <div
                    className={style.div}
                    style={{
                      boxShadow:
                        index === openColor
                          ? "inset 0px 0px 4px 0px white"
                          : null,
                    }}
                    key={index}
                    onClick={() => setOpenColor(index)}
                  >
                    <p>{optID}</p>
                    {imgSetPD && !variantPD && openVariant == 0
                      ? current
                      : imgSetPD && variantPD
                      ? current
                      : null}
                    <p>Stock: {colorStock}</p>
                  </div>
                );
              })}
            </div>
            {variantD ? (
              <div className={style.variants}>
                {variantD}:
                {variants.map((variant, index) => {
                  const { vD, options } = variant;
                  return (
                    <div
                      className={style.div}
                      style={{
                        boxShadow:
                          index === openVariant
                            ? "inset 0px 0px 4px 0px white"
                            : null,
                      }}
                      key={index}
                      onClick={() => setOpenVariant(index)}
                    >
                      <p>{vD}</p>

                      {variantPD ? (
                        <p>₹{options[0].current?.toLocaleString("en-IN")}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className={style.findUser}>
            Enter user email: <input ref={userEmailInput} type="text" />{" "}
            <button onClick={findUser} type="button">
              Find
            </button>
          </div>
          {fName ? (
            <div className={style.afterUserSelected}>
              <div className={style.userInfo}>
                <h2>User Information</h2>
                <p>
                  Full Name:
                  <span>
                    {" "}
                    {fName} {lName}
                  </span>
                </p>
                <p>
                  PinCode: <span>{pinCode}</span>
                </p>
                <p>
                  District: <span>{userDistrict}</span>
                </p>
                <p>
                  State: <span>{userState}</span>
                </p>
                <p>
                  Address: <span>{address}</span>
                </p>
                <p>
                  Email: <span>{email}</span>
                </p>
                <p>
                  Mobile No: <span>{mobileNo}</span>
                </p>
              </div>
              <div className={style.orderSummary}>
                <h3 className={style.h2}>Order Summary</h3>
                <p>
                  product:{" "}
                  <span>
                    ₹{current.toLocaleString("en-IN")} x {qty}
                  </span>
                </p>
                <p>
                  Delivery:{" "}
                  <span>
                    {qty && everyPC && shipping
                      ? `₹${shipping.toLocaleString("en-IN")} x ${qty}`
                      : shipping}
                  </span>
                </p>
                <p>
                  Packaging:{" "}
                  <span>
                    {qty && everyPC && packaging
                      ? `₹${packaging.toLocaleString("en-IN")} x ${qty}`
                      : packaging}
                  </span>
                </p>
                <p className={style.totalAmount}>
                  Total Amount:{" "}
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </p>
                <p className={style.savings}>
                  Your Savings:{" "}
                  <span>
                    ₹
                    {(mrp - totalAmount > 1
                      ? mrp - totalAmount
                      : 0
                    ).toLocaleString("en-IN")}
                  </span>
                </p>
                <label className={style.orderQuantity}>
                  Order Quantity:{" "}
                  <input
                    type="number"
                    defaultValue={1}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (totalStock >= value && value > 0) {
                        setQuantity(value);
                      } else {
                        setQuantity(totalStock);
                        e.target.value = totalStock;
                        alert("Quantity exceeds total stock");
                      }
                    }}
                  />
                </label>
                <h5 className={style.h5}>
                  Delivery Date: <span>{expectD}</span>{" "}
                </h5>
              </div>
              <button
                className={style.paymentBtn}
                onClick={() => {
                  if (totalStock >= qty) {
                    showReceivedAmount.current.showModal();
                  } else {
                    alert("check order quantity");
                  }
                }}
                type="button"
              >
                Payment Type
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default Client;
