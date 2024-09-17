"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./address.module.css";

export default function page() {
  const dispatch = useDispatch();
  const { token, data } = useSelector((data) => data.user);
  let { fName, lName, mobileNo, gender, bDate, bMonth, bYear } = data;

  return (
    <div className={style.mainDiv}>
      <div className={style.secondDiv}>
        <h3>Manage your delivery locations </h3>
      </div>
    </div>
  );
}
