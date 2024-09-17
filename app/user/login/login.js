"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import style from "./login.module.css";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  commonUser,
  dataValueChange,
  getPinInfo,
  login,
  userKeyChange,
} from "@/app/redux/slice/user";
const LoginUser = ({ Link }) => {
  const router = useRouter();
  const passwordInput = useRef();
  const emailInput = useRef();
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();
  const storeName = "loginInfo";
  const [loginInfo, setLoginInfo] = useState({});
  let { reTryPass, reTryForgot } = loginInfo;
  const { intTofP, searchKeys } = useSelector((data) => data.activity);

  const processing = (value) =>
    dispatch(userKeyChange({ name: "uSOS", value }));

  const showWarning = (message) => processing({ type: "Warning", message });
  const pendingTime = (time) => {
    const remaining = ((time - Date.now()) / (1000 * 60 * 60)).toFixed(2);

    const [hours, minute] = remaining.split(".");
    showWarning(`Try After: ${hours} : hours  `);
  };
  const loginFunc = async (event) => {
    event.preventDefault();
    if (reTryPass) {
      reTryPass = new Date(reTryPass);
      if (reTryPass > Date.now()) {
        return pendingTime(reTryPass);
      }
    }
    processing(true);
    const password = passwordInput.current.value;
    const email = emailInput.current.value;
    let user = await fetch(`/api/user/login`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    user = await user.json();
    const { success, message, resReTryPass } = user;
    if (success) {
      localStorage.removeItem(storeName);
      dispatch(login({ message, data: resReTryPass }));
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } else {
      processing({ type: "Error", message, time: 3000 });
      if (resReTryPass) {
        const newInfo = { reTryForgot, reTryPass: resReTryPass };
        localStorage.setItem(storeName, JSON.stringify(newInfo));
        setLoginInfo(newInfo);
      }
    }
  };
  const forgotPassword = async () => {
    if (reTryForgot) {
      reTryForgot = new Date(reTryForgot);
      if (reTryForgot > Date.now()) {
        return pendingTime(reTryForgot);
      }
    }
    const email = emailInput.current.value?.trim();
    if (email === "") {
      return showWarning("please enter email");
    }
    processing(true);
    let user = await fetch(`/api/user/recovery/password`, {
      method: "PUT",
      body: JSON.stringify({
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message, resReTryForget } = await user.json();
    if (resReTryForget) {
      const newInfo = { reTryPass, reTryForgot: resReTryForget };
      localStorage.setItem(storeName, JSON.stringify(newInfo));
      setLoginInfo(newInfo);
    }
    if (success) {
      showWarning(message);
      router.replace("/");
    } else {
      showWarning(message);
    }
  };
  useEffect(() => {
    let data = localStorage.getItem(storeName);
    if (data) setLoginInfo(JSON.parse(data));
  }, []);
  return (
    <section className={style.section}>
      <form className={style.form} onSubmit={loginFunc}>
        <h1>Login / Sing-IN</h1>
        <p>
          Get access to your Orders, Wishlist, Cart, Delivery time and
          Recommendations
        </p>
        <label htmlFor="email">Email</label>
        <input
          ref={emailInput}
          name="email"
          required
          id="email"
          type="email"
          placeholder="enter name"
        />
        <label htmlFor="password">
          Password{" "}
          <span onClick={forgotPassword} className={style.forgotPassword}>
            Forgot Password
          </span>
        </label>
        <input
          ref={passwordInput}
          name="password"
          required
          id="password"
          type="password"
          placeholder="enter surname"
        />
        {wait ? (
          <p className={style.wait}></p>
        ) : (
          <button className={style.login} type="submit">
            Login
          </button>
        )}

        <p>
          By continuing, you agree to riksham's
          <Link href="/user/conditions"> Conditions of Use </Link> and
          <Link href="/user/privacy-policy"> Privacy Notice </Link>.
        </p>
        <Link href="/user/sign-up">Create new account</Link>
      </form>
    </section>
  );
};

export default LoginUser;
