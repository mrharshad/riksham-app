"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import style from "./signUp.module.css";
import states from "../../Layouts/locationState";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  commonUser,
  dataValueChange,
  getDistricts,
  userKeyChange,
} from "@/app/redux/slice/user";

const SignUpComponent = ({ Link }) => {
  const dispatch = useDispatch();
  const defaultState = "Chhattisgarh";
  const { intTofP, searchKeys } = useSelector((data) => data.activity);
  const { data, uSOS } = useSelector((data) => data.user);
  const { districts } = data || {};

  const router = useRouter();
  const [firstStep, setFirstStep] = useState({});
  const [birth, setBirth] = useState();

  const [email, setEmail] = useState();
  const password = useRef();
  const confirmPassword = useRef();
  let { holdTokenSent, tokensSent } = firstStep;
  const currentYear = new Date().getFullYear();

  const stateChange = (value) => dispatch(getDistricts(value));
  const showWarning = (message) => {
    dispatch(
      userKeyChange({ name: "uSOS", value: { type: "Warning", message } })
    );
  };
  const processing = (value) => {
    dispatch(userKeyChange({ name: "uSOS", value }));
  };
  function signUpFunction(formData) {
    if (uSOS) return;
    if (holdTokenSent) {
      holdTokenSent = new Date(holdTokenSent);
      if (holdTokenSent > Date.now()) {
        const pendingTime = ((holdTokenSent - Date.now()) / 60 / 60 / 1000)
          .toFixed(2)
          .toString();

        const [hours, minute] = pendingTime.split(".");
        return showWarning(
          `Try After: ${
            pendingTime.length > 2
              ? `${hours}:hours ${minute}:minutes`
              : `${minute}: minutes`
          }`
        );
      }
    }
    const passwordInput = password.current?.value;
    const confirmInput = confirmPassword.current?.value;
    if (passwordInput !== confirmInput) {
      return showWarning("Password not matching");
    }
    let mobileNo = formData.get("mobileNo");
    let pinCode = formData.get("pinCode");

    if (pinCode.length != 6) {
      return showWarning("Please check pinCode ");
    }

    if (mobileNo.charAt(0) == 0) {
      mobileNo = mobileNo.slice(1);
    }
    if (mobileNo.length != 10) {
      return showWarning("Please check mobile number");
    }
    const validCode = formData.get("validCode");
    if (validCode && validCode == firstStep.validCode) {
      return showWarning("Enter New Verification Code");
    }
    processing(true);
    setTimeout(async () => {
      const data = {
        fName: formData.get("fName"),
        lName: formData.get("lName"),
        address: formData.get("address"),
        mobileNo,
        email,
        gender: formData.get("gender"),
        birth,
        validCode,
        password: passwordInput,
        intTofP,
        searchKeys,
        pinCode: formData.get("pinCode"),
        area: formData.get("area"),
        state: formData.get("state"),
        district: formData.get("district"),
      };
      const request = await fetch(`/api/user/create-new-account`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, message, tokensSent } = await request.json();

      if (message === "already has an account created")
        setTimeout(() => router.replace("/user/login"), 3000);

      if (success) {
        processing({ type: "Success", message, time: 5000 });
      } else return processing({ type: "Error", message, time: 5000 });

      if (request.status == 201) {
        localStorage.removeItem("newAccount");
        localStorage.removeItem("IntTofP");
        localStorage.removeItem("SearchKeys");
        router.replace("/");
        dispatch(
          commonUser({
            oldData: tokensSent,
            oldToken: tokensSent.token,
          })
        );
      } else {
        if (message.includes("try after:")) {
          data.holdTokenSent = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        data.tokensSent = tokensSent ? tokensSent + 1 : 1;
        localStorage.setItem("newAccount", JSON.stringify(data));
        setFirstStep(data);
      }
    }, 1000);
  }
  useEffect(() => {
    let data = localStorage.getItem("newAccount");
    const stateElement = document.getElementById("state");

    if (data) {
      data = JSON.parse(data);
      setFirstStep(data);
      const { birth, email, gender, state } = data;
      document.getElementById(gender).checked = true;
      setBirth(birth);
      setEmail(email);
      stateChange(state);
      stateElement.value = state;
    } else {
      stateChange(defaultState);
      stateElement.value = defaultState;
    }
  }, []);

  function funcSetPassword(e) {
    const input = e.target.value;
    let length = input.length;
    const inputName = e.target.name;
    if (input.includes(" ")) {
      e.target.value = input.trim();
      return showWarning("space not allow");
    }

    const match = (inputName === "confirmPassword" ? password : confirmPassword)
      .current.value;

    if (match.length == 0 || length == 0) {
      e.target.style.borderColor =
        length > 7
          ? "green"
          : length > 5
          ? "yellow"
          : length > 0
          ? "red"
          : "transparent";
    } else {
      for (let i = 0; i < length; i++) {
        if (match.charAt(i) === input.charAt(i)) {
          e.target.style.borderColor = "green";
        } else {
          if (length > 0) {
            e.target.style.borderColor = "red";
          } else {
            e.target.style.borderColor = "transparent";
          }
          length = 0;
        }
      }
    }
  }

  return (
    <section className={style.section}>
      <div className={style.container}>
        <h1>Create Account</h1>
        <form className={style.firstStep} action={signUpFunction}>
          <label htmlFor="fName">First Name</label>
          <input
            defaultValue={firstStep.fName}
            required
            name="fName"
            id="fName"
            type="text"
            minLength={3}
          />
          <label htmlFor="lName">Last Name (surname)</label>
          <input
            defaultValue={firstStep.lName}
            required
            name="lName"
            id="lName"
            type="text"
            minLength={3}
          />
          <div className={style.email}>
            <label htmlFor="email">Email</label>
            <input
              defaultValue={firstStep.email}
              onChange={(e) => {
                let [userName, domain] = e.target.value.split("@");
                const regex = /^[a-z0-9]+$/i;
                userName = userName.toLowerCase().trim();
                setEmail((pre) => {
                  if (userName.length > 1) {
                    if (regex.test(userName)) {
                      e.target.value = userName;
                      return userName;
                    } else {
                      e.target.value = pre;
                      return pre;
                    }
                  } else {
                    e.target.value = userName;
                    return userName;
                  }
                });
              }}
              required
              id="email"
              type="text"
            />
            <span>@gmail.com</span>
          </div>
          <div className={style.stateContainer}>
            <label htmlFor="mobileNo">Mobile Number</label>
            <label>Date Of Birth</label>

            <input
              defaultValue={firstStep.mobileNo}
              name="mobileNo"
              required
              id="mobileNo"
              type="number"
            />

            <div className={style.birth}>
              <input
                max={`${currentYear - 4}-01-01`}
                min={`${currentYear - 80}-01-01`}
                required
                defaultValue={birth?.dateType}
                onChange={(e) => {
                  const value = e.target.value;
                  const [year, month, date] = value.split("-");
                  setBirth({
                    textType: `${date}-${month}-${year}`,
                    dateType: value,
                  });
                }}
                type="date"
                name="birth"
                id="birth"
              />
              <span>{birth?.textType}</span>
            </div>

            <label htmlFor="state">State</label>
            <label htmlFor="district">District</label>
            <select
              onChange={(e) => stateChange(e.target.value)}
              className={style.area}
              name="state"
              id="state"
              required
            >
              {states.map((stName) => (
                <option value={stName} key={stName}>
                  {stName}
                </option>
              ))}
            </select>

            {districts ? (
              <select
                className={style.area}
                defaultValue={firstStep.district || districts[0]}
                name="district"
                id="district"
                required
              >
                {districts.map((disName) => (
                  <option value={disName} key={disName}>
                    {disName}
                  </option>
                ))}
              </select>
            ) : (
              <p className={style.skeleton}></p>
            )}
            <label htmlFor="pinCode">PinCode</label>
            <label htmlFor="area">Area</label>
            <input
              name="pinCode"
              defaultValue={firstStep.pinCode}
              required
              type="number"
              id="pinCode"
            />

            <input
              name="area"
              defaultValue={firstStep.area}
              required
              id="area"
              type="text"
              maxLength={20}
            />
          </div>

          <label htmlFor="address">Address</label>
          <input
            defaultValue={firstStep.address}
            name="address"
            required
            id="address"
            type="text"
            minLength={10}
          />

          <div className={style.gender}>
            <p>Gender</p>
            <label htmlFor="male">
              Male
              <input
                type="radio"
                required
                name="gender"
                id="male"
                value="male"
              />
            </label>

            <label htmlFor="female">
              Female{" "}
              <input
                type="radio"
                required
                name="gender"
                id="female"
                value="female"
              />
            </label>
          </div>

          {tokensSent > 0 && (
            <>
              <div className={style.checkMail}>
                <p>Check your mail inbox</p>
                <p></p>
              </div>
              <label htmlFor="password">Password</label>
              <input
                onChange={funcSetPassword}
                required
                name="password"
                id="password"
                ref={password}
                minLength={8}
                maxLength={20}
                type="password"
                placeholder="greater than 8 characters "
                className={style.password}
              />
              <label htmlFor="password">Confirm Password</label>
              <input
                onChange={funcSetPassword}
                required
                id="confirm"
                name="confirmPassword"
                ref={confirmPassword}
                minLength={8}
                maxLength={20}
                type="password"
                placeholder="greater than 8 characters "
                className={style.password}
              />
              <label className={style.verifyLabel} htmlFor="password">
                Enter 6 digit verification code
                <input
                  className={style.verifyInput}
                  name="validCode"
                  required
                  id="token"
                  minLength={6}
                  maxLength={6}
                  type="text"
                />
              </label>
            </>
          )}
          <button id="verify" type="submit">
            Verify
          </button>
          <p>
            Already have an account? <Link href="/user/login"> Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUpComponent;
