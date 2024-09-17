"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import style from "./orders.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  dOrderGet,
  getMyOrders,
  lOrderSet,
  orderInfoManage,
  userKeyChange,
} from "@/app/redux/slice/user";
import { useRouter } from "next/navigation";

const Client = () => {
  const dispatch = useDispatch();
  const user = useSelector((obj) => obj.user);
  const { orderInfo = {}, loadingOrder, data } = user;
  const { fName } = data;
  const router = useRouter();
  const { opened = "newOrder", searchKey } = orderInfo;
  const isDelivered = opened === "delivered" || opened === "key";
  const isNewOrder = opened === "newOrder";
  if (!fName) return setTimeout(() => router.replace("/user/login"), 100);

  const changeStatus = (value) =>
    dispatch(orderInfoManage({ name: "opened", value }));

  const displayStyle = async (value) => {
    const element = document.getElementById("pOrderLoading");
    if (element && element.style.display !== value)
      element.style.display = value;
  };
  const { orders, numOfOrder, page } = useMemo(() => {
    const orders = user[opened];
    const getPage = orderInfo[opened + "P"];

    const page = getPage === undefined ? 1 : getPage;
    const numOfOrder = orders.length;
    if (getPage === null || opened == "key") displayStyle("none");
    else displayStyle("grid");
    return {
      orders,
      numOfOrder,
      page,
    };
  }, [opened, loadingOrder]);

  const dateFormatter = new Intl.DateTimeFormat("en-In", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) dispatch(lOrderSet(true));
        });
      },
      {
        // root: document.querySelector("nav"),
        // rootMargin: "100px",
        // threshold: 0,
      }
    );

    const items = document.querySelector(`#pOrderLoading`);
    observer.observe(items);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (loadingOrder && page === null)
      dispatch(userKeyChange({ name: "loadingOrder", value: false }));
    if (loadingOrder && page != null)
      dispatch(getMyOrders({ page, opened, searchKey }));
  }, [loadingOrder]);

  const search = () => {
    const key = document.getElementById("deliveredKey").value.trim();
    const length = key.length;
    if (length < 4 && length > 0) return alert("Write 4 Characters");
    if (!loadingOrder && searchKey !== key && orderInfo.delivered)
      dispatch(dOrderGet({ key, keyArr: orderInfo["key"] }));
  };

  const convertedURL = (text) => text.replace(/ /g, "-");
  return (
    <>
      <div className={style.options}>
        <p>Your Orders</p>
        <div className={style.status}>
          <span
            onClick={() => changeStatus("newOrder")}
            style={{
              borderBottom: `1px solid ${
                opened === "newOrder" ? "#00ceff" : "white"
              }`,
            }}
          >
            Pending
          </span>
          <span
            onClick={() => changeStatus("canceled")}
            style={{
              borderBottom: `1px solid ${
                opened === "canceled" ? "#00ceff" : "white"
              }`,
            }}
          >
            Canceled
          </span>
          <span
            onClick={() => changeStatus("delivered")}
            style={{
              borderBottom: `1px solid ${isDelivered ? "#00ceff" : "white"}`,
            }}
          >
            Delivered
          </span>
        </div>

        {isDelivered && (
          <div className={style.search}>
            <input
              placeholder="Delivered Orders..."
              type="text"
              name="key"
              id="deliveredKey"
            />
            <button onClick={search} type="button">
              Search
            </button>
          </div>
        )}
      </div>
      <div className={style.orders}>
        {orders.map(({ _id: orderId, items }) =>
          items.map(
            ({
              _id,
              name,
              tOfP,
              time,
              image,
              statusUP,
              status,
              qty,
              current,
            }) => (
              <div className={style.order} key={`${orderId}:${_id}`}>
                <Link
                  href={`order?id=${orderId}&item=${_id}&status=${opened}`}
                  prefetch={false}
                  className={style.name}
                >
                  {name}
                </Link>
                <span>{dateFormatter.format(new Date(statusUP))}</span>
                {isNewOrder ? (
                  <span>{status}</span>
                ) : isDelivered ? (
                  <Link href={`${_id}`}>Write a review</Link>
                ) : null}

                <Link
                  prefetch={false}
                  className={style.imgLink}
                  href={`/single-p/?_id=${_id}&k=${convertedURL(name)}`}
                >
                  <Image
                    height={200}
                    width={200}
                    alt="Product Image"
                    src={image}
                  />
                </Link>

                {isDelivered ? (
                  <p className={style.tOfP}>{tOfP}</p>
                ) : (
                  <p className={style.arriving}>
                    {isNewOrder ? "Arriving" : "Reason"}
                    <span>{time}</span>
                  </p>
                )}
                <p className={style.qty}>
                  Qty: <span>{qty}</span>
                </p>
                <p className={style.price}>
                  Price: ₹<span>{current.toLocaleString("en-IN")}</span>
                </p>
              </div>
            )
          )
        )}
        {!numOfOrder && !loadingOrder && <p>No Orders</p>}
        <p id="pOrderLoading" className={style.loading}>
          Loading...
        </p>
      </div>
    </>
  );
};

export default Client;
