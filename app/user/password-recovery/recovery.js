"use client";
import React, { useRef, useState } from "react";
import style from "./recovery.module.css";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login, userKeyChange } from "@/app/redux/slice/user";
import Link from "next/link";
const Recovery = ({ token, email }) => {
  const dispatch = useDispatch();
  const password = useRef("");
  const confirmPassword = useRef("");
  const button = useRef();
  const router = useRouter();
  const setData = (e) => {
    const targe = e.target;
    const length = targe.value.length;
    const passValue = password.current.value;
    const confPassValue = confirmPassword.current.value;
    targe.style.outlineColor =
      length > 7
        ? "green"
        : length > 5
        ? "yellow"
        : length > 0
        ? "red"
        : "white";

    if (length > 7 && passValue === confPassValue) {
      button.current.style.visibility = "visible";
      button.current.style.opacity = 10;
    } else {
      button.current.style.visibility = "hidden";
      button.current.style.opacity = 0;
    }
  };
  const processing = (value) => {
    dispatch(userKeyChange({ name: "uSOS", value }));
  };
  const setPassword = async () => {
    const passValue = password.current.value;
    const confPassValue = confirmPassword.current.value;
    if (passValue.length > 7 && confPassValue === passValue) {
      processing(true);
      const verify = await fetch(`/api/user/verification/recovery-password`, {
        method: "PUT",
        body: JSON.stringify({
          password: passValue,
          key: token,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, message, data } = await verify.json();
      if (success) {
        localStorage.removeItem("loginInfo");
        dispatch(login({ message, data }));
        router.replace("/");
      } else processing({ type: "Error", message });
    }
  };
  return (
    <section id="productUser" className={style.section}>
      <div className={style.container}>
        <h1>Set New Password:</h1>
        <div className={style.password}>
          <label>Password:</label>
          <input ref={password} onChange={setData} type="password" />
        </div>
        <div className={style.confirmPassword}>
          <label>Re-enter:</label>
          <input ref={confirmPassword} onChange={setData} type="password" />
        </div>
        <button onClick={setPassword} ref={button} type="button">
          Set Password
        </button>
        <p>
          If you don't want to change the password:{" "}
          <Link href="/">click here</Link>
        </p>
      </div>
    </section>
  );
};

export default Recovery;
