"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./details.module.css";
import { updateDetails } from "@/app/redux/slice/user";
const page = () => {
  const dispatch = useDispatch();
  const { token, data } = useSelector((data) => data.user);
  let { fName, lName, mobileNo, gender, bDate, bMonth, bYear } = data;
  const [birth, setBirth] = useState();
  const currentYear = new Date().getFullYear();
  const [oldData, setOldData] = useState();

  const update = (formData) => {
    dispatch(
      updateDetails({
        fName: formData.get("fName"),
        lName: formData.get("lName"),
        gender: formData.get("gender"),
        birth: birth.dateType,
        mobileNo: formData.get("mobileNo"),
        token,
        oldData,
      })
    );
  };
  useEffect(() => {
    if (String(bDate).length < 2) {
      bDate = `0${bDate}`;
    }
    if (String(bMonth).length < 2) {
      bMonth = `0${bMonth}`;
    }
    const dateType = `${bYear}-${bMonth}-${bDate}`;
    setOldData(
      JSON.stringify({ fName, lName, mobileNo, gender, birth: dateType })
    );
    setBirth({
      textType: `${bDate}-${bMonth}-${bYear}`,
      dateType,
    });
    document.getElementById(gender).checked = true;
  }, []);
  return (
    <div className={style.mainDiv}>
      <form action={update} className={style.form}>
        <h3>
          Your Details <Link href={"/admin/user/account"}>Close</Link>
        </h3>
        <label htmlFor="fName">
          First Name:
          <input
            minLength={3}
            required
            defaultValue={fName}
            type="text"
            name="fName"
            id="fName"
          />
        </label>
        <label htmlFor="lName">
          Last Name:
          <input
            required
            defaultValue={lName}
            type="text"
            name="lName"
            id="lName"
            minLength={3}
          />
        </label>
        <label htmlFor="mobileNo">
          Mobile Number:
          <input
            defaultValue={mobileNo}
            type="text"
            name="mobileNo"
            id="mobileNo"
          />
        </label>
        <div className={style.personalInfo}>
          <p>Gender</p>
          <label htmlFor="Male">
            Male
            <input type="radio" required name="gender" id="Male" value="Male" />
          </label>

          <label htmlFor="Female">
            Female{" "}
            <input
              type="radio"
              required
              name="gender"
              id="Female"
              value="Female"
            />
          </label>
        </div>
        <div className={style.personalInfo}>
          <p className={style.birth}>Date Of Birth</p>
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
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
};

export default page;
