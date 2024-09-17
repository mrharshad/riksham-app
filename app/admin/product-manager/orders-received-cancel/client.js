"use client";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import style from "./page.module.css";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  mainKeyChange,
  pOMKeyChange,
  pOSChange,
} from "@/app/redux/slice/manager";
import { UserAlert, Wait } from "@/app/Layouts/toastAndWait";
const Client = () => {
  const pOManage = useSelector((obj) => obj.manager)?.pOM;
  const { loading, allOrders = [], pages = {} } = pOManage || {};
  const dispatch = useDispatch();
  const [updateStatus, setUpdateStatus] = useState({});
  const { orderId, name, newStatus, userId } = updateStatus;
  const reasonInput = useRef();
  const [status, setStatus] = useState("Pending");
  const [fetchNow, setFetchNow] = useState();
  const displayStyle = async (value) => {
    const element = document.getElementById("pOManage");
    if (element && element.style.display !== value)
      element.style.display = value;
  };
  const openedArr =
    status == "Delivered" || status == "Canceled" ? status : "newOrder";
  const statuses = [
    "Pending",
    "Confirm",
    "Dispatch",
    "Out for Delivery",
    "Canceled",
    "Delivered",
  ];
  const { page, orders, nextStatus } = useMemo(() => {
    let page = pages[openedArr.toLowerCase() + "P"];
    const nextStatus = statuses.slice(
      statuses.findIndex((data) => data == status) + 1
    );

    if (loading?.type) {
      if (name) setUpdateStatus({});
      setTimeout(
        () => dispatch(pOMKeyChange({ name: "loading", value: false })),
        loading.time || 2000
      );
    }
    if (loading) return { page, nextStatus, orders: [] };

    let orders;
    if (openedArr !== "newOrder")
      orders = allOrders.filter((obj) => obj.status == status.toLowerCase());
    else
      orders = allOrders.flatMap(({ items, ...data }) => ({
        ...data,
        items: items.filter((item) => item.status == status),
      }));

    displayStyle(page === null ? "none" : "grid");
    return {
      orders,
      page,
      nextStatus,
    };
  }, [loading, status]);

  const getOrder = (value) => {
    setStatus(value);
  };

  useEffect(() => {
    if (!pOManage)
      dispatch(
        mainKeyChange({ name: "pOM", value: { allOrders: [], pages: {} } })
      );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setFetchNow(Math.floor(Math.random() * 1000));
        });
      },
      {
        // root: document.querySelector("nav"),
        // rootMargin: "100px",
        // threshold: 0,
      }
    );

    const items = document.querySelector(`#pOManage`);
    observer.observe(items);
    return () => {
      observer.disconnect();
    };
  }, []);
  const getProOrder = async ({ status, page }) => {
    dispatch(pOMKeyChange({ name: "loading", value: true }));
    const request = await fetch(`/api/admin/product-manager/get-orders`, {
      method: "PUT",
      body: JSON.stringify({ page, status }),
      headers: { "Content-Type": "application/json" },
    });
    const { success, message, orders } = await request.json();

    const numOfOrder = orders?.length;
    const newPages = Object.assign(
      { ...pages },
      {
        [`${status}P`]: !numOfOrder || numOfOrder < 20 ? null : page + 1,
      }
    );

    const notNew = (obj) => ({
      ...obj[status],
      userId: obj._id,
      status,
    });

    const pOM = Object.assign(
      { ...pOManage },
      {
        loading: success ? false : { type: "Error", message, time: 5000 },
        allOrders: allOrders.concat(
          openedArr == "newOrder" ? orders : success ? orders.map(notNew) : []
        ),
        pages: newPages,
      }
    );

    dispatch(mainKeyChange({ name: "pOM", value: pOM }));
  };

  useEffect(() => {
    if (loading || page === null || !fetchNow) return;

    getProOrder({
      page: page === undefined ? 1 : page,
      status: openedArr.toLowerCase(),
    });
  }, [fetchNow]);
  const dateFormatter = new Intl.DateTimeFormat("en-In", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updateFun = () => {
    const reason = reasonInput.current?.value.trim();
    const query = { ...updateStatus, reason };
    if (newStatus == "Canceled" && reason.length < 10)
      return alert("Please enter reason");
    dispatch(pOSChange(query));
  };
  const newStatusSet = (newStatus) =>
    setUpdateStatus({ ...updateStatus, newStatus });

  return (
    <>
      {loading?.type && UserAlert(loading)}
      {loading && !loading?.type && Wait()}
      <section className={style.section} id="productUser">
        {orderId && (
          <div className={style.updateBtn}>
            <div>
              <h3>
                Update Status <span>ID {orderId}</span>
              </h3>
              <p>
                <span>Name </span>
                {name}
              </p>
              <p>
                <span>Current</span> {status}
              </p>
              <div className={style.statuses}>
                {nextStatus.map((st) => (
                  <span
                    onClick={() => newStatusSet(st)}
                    style={{
                      borderColor: newStatus == st ? "#00ceff" : "lightgray",
                    }}
                    key={st}
                  >
                    {st}
                  </span>
                ))}
              </div>
              {newStatus == "Canceled" && (
                <label htmlFor="reason">
                  <input
                    type="text"
                    name="reason"
                    id="reason"
                    placeholder="Enter reason"
                    ref={reasonInput}
                  />
                </label>
              )}
              <button onClick={() => setUpdateStatus({})}>Close</button>
              {newStatus && (
                <button onClick={updateFun} className={style.submit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
        <h1 className={style.h1}>Order Manage</h1>
        <div className={style.options}>
          {statuses.map((type) => (
            <span
              key={type}
              style={status == type ? { borderColor: "#00ceff" } : null}
              onClick={() => getOrder(type)}
            >
              {type}
            </span>
          ))}
        </div>
        <div className={style.orders}>
          {orders.map(
            ({
              _id: oId,
              state,
              district,
              address,
              items,
              userId,
              area,
              uName,
            }) =>
              items.map(
                ({
                  _id,
                  name,
                  image,
                  iSN,
                  imageSetD,
                  vD,
                  current,
                  qty,
                  time,
                  tOfP,
                  statusUP,
                  variantD,
                }) => (
                  <div key={+`${oId}${_id}`} className={style.order}>
                    <p className={style.name}>{name}</p>
                    <div className={style.oDOption}>
                      <p>{tOfP}</p>
                      {variantD && (
                        <p>
                          {variantD} : <span>{vD}</span>
                        </p>
                      )}
                      {imageSetD && (
                        <p>
                          {imageSetD} : <span>{iSN}</span>
                        </p>
                      )}
                    </div>
                    <Image
                      width={200}
                      height={150}
                      src={image}
                      alt="product Img"
                    />
                    <div className={style.price}>
                      <span>₹{current.toLocaleString("en-IN")} </span>
                      <span> x {qty}</span>
                      <p className={style.updated}>
                        <span>Updated </span>
                        {dateFormatter.format(new Date(statusUP))}
                      </p>
                      <div className={style.reasonDiv}>
                        <p>
                          <span>User ID: </span>
                          {userId}
                        </p>
                        {openedArr == "newOrder" ? (
                          <button
                            onClick={() =>
                              setUpdateStatus({
                                orderId: `${oId}-${_id}`,
                                userId,
                                name,
                              })
                            }
                          >
                            Update Status
                          </button>
                        ) : (
                          <p>{time}</p>
                        )}
                      </div>
                    </div>
                    <p className={style.uName}>Name: {uName}</p>
                    <div className={style.location}>
                      <span>{area}</span>
                      <span>{district}</span>
                      <span>{state}</span>

                      <p> Address: {address}</p>
                    </div>
                  </div>
                )
              )
          )}
          <div id="pOManage">Loading...</div>
        </div>
      </section>
    </>
  );
};

export default Client;
