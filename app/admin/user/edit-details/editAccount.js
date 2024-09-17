"use client";
import React, { useEffect, useState } from "react";
import style from "./editAccount.module.css";
import { useRouter } from "next/navigation";
import { Wait } from "@/app/Layouts/toastAndWait";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const EditAccount = ({ user, token, Link, query }) => {
  const { msg } = query;

  useEffect(() => {
    setTimeout(() => {
      if (msg) {
        alert(msg);
      }
    }, 1000);
  }, []);
  const {
    fName,
    lName,
    mobileNo,
    createdAt,
    address,
    pinCode,
    state: oldState,
    district,
    gender,
    bDate,
    bMonth,
    bYear,
    email,
    password: hashedPassword,
  } = user;
  const router = useRouter();
  const [wait, setWait] = useState(false);
  const [state, setState] = useState(oldState);
  const [districts, setDistricts] = useState([]);

  let oldBirthDate = bDate >= 10 ? bDate : `0${bDate}`;
  let oldBirthMonth = bMonth >= 10 ? bMonth : `0${bMonth}`;

  const [birth, setBirth] = useState({
    textType: `${oldBirthDate}-${oldBirthMonth}-${bYear}`,
    dateType: `${bYear}-${oldBirthMonth}-${oldBirthDate}`,
  });
  function editAccount(formData) {
    let mobileNo = formData.get("mobileNo");
    let pinCode = formData.get("pinCode");

    if (pinCode.length != 6) {
      return alert("Please check pinCode ");
    }

    if (mobileNo.charAt(0) == 0) {
      mobileNo = mobileNo.slice(1);
    }
    if (mobileNo.length != 10) {
      return alert("Please check mobile number");
    }

    setWait(true);
    setTimeout(async () => {
      let addDetails = await fetch(
        `${process.env.PROTOCOL_AND_HOST}/api/admin/user/edit-details`,
        {
          method: "PUT",
          body: JSON.stringify({
            fName: formData.get("fName"),
            lName: formData.get("lName"),
            address: formData.get("address"),
            pinCode,
            district: formData.get("district"),
            state,
            mobileNo,
            gender: formData.get("gender"),
            birth: birth.dateType,
            hashedPassword,
            email,
            token,
            password: formData.get("password"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      addDetails = await addDetails.json();

      alert(addDetails.message);
      if (addDetails.success) {
        router.replace("/");
        router.refresh();
      } else {
        setWait(false);
      }
    }, 1000);
  }

  useEffect(() => {
    const findDistricts = async () => {
      const find = await fetch(
        `${process.env.PROTOCOL_AND_HOST}/api/districts?key=${state}`
      );
      setDistricts((await find.json()).state);
    };
    findDistricts();
    document.querySelector(`#${gender}`).checked = true;
  }, [state]);

  return (
    <section id="productUser" className={style.section}>
      {wait ? <Wait /> : null}
      <form action={editAccount} className={style.form}>
        <h1>Edit user account</h1>
        <p>
          Created Account:
          <span> {createdAt}</span>
        </p>
        <label htmlFor="fName">First Name</label>
        <input
          defaultValue={fName}
          name="fName"
          required
          id="fName"
          type="text"
        />
        <label htmlFor="lName">Last Name (surname)</label>
        <input
          defaultValue={lName}
          name="lName"
          required
          id="lName"
          type="text"
        />

        <div className={style.stateContainer}>
          <label htmlFor="mobileNo">Mobile Number</label>
          <label htmlFor="state">State</label>
          <input
            name="mobileNo"
            required
            defaultValue={mobileNo}
            id="mobileNo"
            type="number"
          />
          <select
            onChange={(e) => {
              setState(e.target.value);
            }}
            name="state"
            id="state"
            defaultValue={state}
          >
            {states.map((sta) => (
              <option value={sta} key={sta}>
                {sta}
              </option>
            ))}
          </select>
          <label htmlFor="pinCode">PinCode </label>
          <label htmlFor="district">District</label>
          <input
            name="pinCode"
            required
            defaultValue={pinCode}
            id="pinCode"
            type="number"
          />
          <select defaultValue={district} name="district" id="district">
            {oldState === state ? (
              <option value={district}>{district}</option>
            ) : null}
            {districts.map((dis) => {
              return dis !== district ? (
                <option value={dis} key={dis}>
                  {dis}
                </option>
              ) : null;
            })}
          </select>
        </div>

        <label htmlFor="address">Address</label>
        <input
          name="address"
          required
          defaultValue={address}
          id="address"
          type="text"
        />
        <div className={style.personalInfo}>
          <p>Gender</p>

          <label htmlFor="Male">
            Male
            <input type="radio" required name="gender" id="Male" value="male" />
          </label>

          <label htmlFor="Female">
            Female{" "}
            <input
              type="radio"
              required
              name="gender"
              id="Female"
              value="female"
            />
          </label>
        </div>
        <div className={style.personalInfo}>
          <p>Date Of Birth</p>
          <input
            required
            defaultValue={birth.dateType}
            onChange={(e) => {
              const value = e.target.value;

              const currentYear = new Date().getFullYear();
              const [year, month, date] = value.split("-");
              if (currentYear - 4 > +year && currentYear - 80 < +year) {
                setBirth({
                  textType: `${date}-${month}-${year}`,
                  dateType: value,
                });
              } else {
                e.target.value = "";
                setBirth();
                alert(
                  "Anyone above 4 years of age and below 80 years can sign up."
                );
              }
            }}
            type="date"
            name=""
            id=""
          />
          <span>{birth?.textType}</span>
        </div>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          required
          id="password"
          minLength={8}
          type="password"
          placeholder="greater than 8 characters "
        />

        <button type="submit">Save Details</button>
        <p>
          Email address:
          <Link href="change-email"> Change</Link>
        </p>
        <p>
          Create / Set new password:
          <Link href="change-password"> Change</Link>
        </p>
      </form>
    </section>
  );
};

export default EditAccount;
