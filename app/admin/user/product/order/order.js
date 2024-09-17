"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import style from "./order.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  dOrderGet,
  getMyOrders,
  lOrderSet,
  orderInfoManage,
  userKeyChange,
} from "@/app/redux/slice/user";
import { useRouter } from "next/navigation";

const Client = ({ id, item, status }) => {
  const reasons = useRef();
  const textareaData = useRef();
  const [cancelReason, setCancelReason] = useState("Order Created By Mistake");
  const [newRating, setNewRating] = useState();
  const dispatch = useDispatch();
  const user = useSelector((obj) => obj.user);
  const { token, orderInfo = {}, loadingOrder, uSOS } = user;
  const router = useRouter();

  const {
    address,
    area,
    createdAt,
    district,
    iSN,
    image,
    imageSetD,
    name,
    pinCode,
    qty,
    state,
    current,
    tOfP,
    time,
    vD,
    variantD,
    tofPay,
  } = useMemo(() => {
    const { items, ...info } =
      (user[status] || []).find((obj) => obj._id == id) || {};
    const findItem = (items || []).find((obj) => obj._id == item);

    return { ...info, ...findItem };
  }, []);
  if (!name) return setTimeout(() => router.replace("orders"), 1000);
  const dateFormatter = new Intl.DateTimeFormat("en-In", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const createReason = (e) => {
    reasons.current.style.maxHeight = "30px";
    setCancelReason(e.target.textContent);
  };
  const reasonsOpts = [
    "Order Created By Mistake",
    "Item Would Not Arrive On Time",
    "Shipping Cost Too High",
    "Item Price Too High",
    "Packaging Cost Too High",
    "Another",
  ];
  const ratingChoose = (e) => {
    setNewRating(e.target.value);
  };

  const userSos = (value) => dispatch(userKeyChange({ name: "uSOS", value }));
  const cancelOrder = async () => {
    const reason =
      cancelReason === "Another"
        ? textareaData.current?.value.trim()
        : cancelReason;
    if (cancelReason === "Another" && reason.length < 20)
      return alert("Write a little more about the reason");
    userSos(true);
    const request = await fetch(`/api/admin/user/product/order-cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason, id, item }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message, order } = await request.json();
    if (success) {
      userSos({ type: "Success", message, time: 3000 });

      setTimeout(() => {
        router.replace("/");
        let orders = [...user.newOrder];
        if (order) orders[orders.findIndex((obj) => obj._id == id)] = order;
        else orders = orders.filter((obj) => obj._id != id);

        dispatch(
          userKeyChange({
            name: "newOrder",
            value: orders,
          })
        );
      }, 3000);
    } else userSos({ type: "Error", message, time: 3000 });
  };
  const submitRating = async () => {
    const comment = textareaData.current.value.trim();
    if (!newRating) return alert("Choose Rating");
    if (comment.length < 20) return alert("Write some more comments");

    userSos(true);
    const request = await fetch(`/api/admin/user/product/review`, {
      method: "PUT",
      body: JSON.stringify({ newRating, comment, id, item }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message } = await request.json();
    if (success) {
      setTimeout(() => router.replace("/"), 3000);
      userSos({ type: "Success", message, time: 3000 });
    } else userSos({ type: "Error", message, time: 3000 });
  };
  const convertedURL = (text) => text.replace(/ /g, "-");
  return (
    <div className={style.main}>
      <h1>
        Order Details <span>ID {`${id}-${item}`}</span>
      </h1>
      <h2>
        {name}
        {variantD && <span>{vD}</span>}
        {imageSetD && <span>{iSN}</span>}
      </h2>
      <Link
        prefetch={false}
        className={style.imgLink}
        href={`/single-p/?_id=${item}&k=${convertedURL(name)}`}
      >
        <Image height={200} width={200} alt="Product Image" src={image} />
      </Link>
      <p>
        Order Placed :<span> {dateFormatter.format(new Date(createdAt))}</span>
      </p>
      <p>
        ₹{current} x {qty} = ₹<span>{current * qty} </span>
      </p>
      <p>
        Payment : <span>{tofPay}</span>
      </p>
      <div className={style.location}>
        <p className={style.locP}>Delivery Location</p>
        <p>
          State : <span>{state}</span>
        </p>
        <p>
          District : <span>{district}</span>
        </p>
        <p>
          Area : <span>{area}</span>
        </p>
        <p>
          Address : <span>{address}</span>
        </p>
      </div>
      {status == "newOrder" && (
        <div className={style.canceled}>
          <div ref={reasons} className={style.reasons}>
            <p
              onClick={() => {
                let style = reasons.current.style;
                if (style.maxHeight == "30px") {
                  style.maxHeight = "300px";
                } else {
                  style.maxHeight = "30px";
                }
              }}
            >
              {cancelReason} <span> &#8595; </span>
            </p>
            {reasonsOpts.map((opt) => (
              <span
                key={opt}
                style={
                  cancelReason == opt
                    ? {
                        backgroundColor: "rgb(42 42 42)",
                      }
                    : null
                }
                onClick={createReason}
              >
                {opt}
              </span>
            ))}
          </div>
          {cancelReason === "Another" && (
            <textarea
              ref={textareaData}
              placeholder="enter your reason..."
              maxLength={100}
              cols="30"
              rows="5"
              className={style.commentInput}
            ></textarea>
          )}
          {!uSOS && (
            <button className={style.btn} type="button" onClick={cancelOrder}>
              Cancel Order
            </button>
          )}
        </div>
      )}
      {status == "delivered" && (
        <div className={style.reviews}>
          <label className={style.commentLabel} htmlFor="comment">
            Wright Comment
          </label>
          <div className={style.rating}>
            <input
              onClick={ratingChoose}
              type="radio"
              id="star5"
              name="rating"
              value={5}
            />
            <label htmlFor="star5"></label>
            <input
              onClick={ratingChoose}
              type="radio"
              id="star4"
              name="rating"
              value={4}
            />
            <label htmlFor="star4"></label>
            <input
              onClick={ratingChoose}
              type="radio"
              id="star3"
              name="rating"
              value={3}
            />
            <label htmlFor="star3"></label>
            <input
              onClick={ratingChoose}
              type="radio"
              id="star2"
              name="rating"
              value={2}
            />
            <label htmlFor="star2"></label>
            <input
              onClick={ratingChoose}
              type="radio"
              id="star1"
              name="rating"
              value={1}
            />
            <label htmlFor="star1"></label>
          </div>

          <textarea
            ref={textareaData}
            name="comment"
            className={style.commentInput}
            id="comment"
            type="text"
            placeholder="What did you like or dislike? About this product, please share with everyone"
          />
          {!uSOS && (
            <button onClick={submitRating} className={style.btn}>
              Submit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Client;
