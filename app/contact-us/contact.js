"use client";
import React, { Fragment, useState } from "react";
import style from "./contact.module.css";
import { useRouter } from "next/navigation";
import saveMessage from "./userMessage";
import { useDispatch } from "react-redux";
import { userKeyChange } from "../redux/slice/user";
const Contact = ({ Link, email, lName, fName }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = (value) => dispatch(userKeyChange({ name: "uSOS", value }));
  const submitFunc = async (formData) => {
    const cUsTopic = formData.get("cUsTopic");
    if (!cUsTopic) {
      return loading({ type: "Warning", message: "please select your topic" });
    }
    const privacy = formData.get("privacy");
    if (!privacy) {
      return loading({
        type: "Warning",
        message: "please check privacy policy",
      });
    }
    loading(true);
    const request = await saveMessage({
      cUsName: formData.get("cUsName"),
      cUsEmail: formData.get("cUsEmail"),
      cUsTopic,
      cUsMessage: formData.get("cUsMessage"),
    });

    const { success, message } = request;

    if (success) {
      loading({ type: "Success", message });
      router.replace("/");
    } else loading({ type: "Error", message, time: 4000 });
  };

  return (
    <Fragment>
      <form className={style.form} action={submitFunc}>
        <h2>Your questions will definitely be answered</h2>
        <label htmlFor="cUsName">Your Name: </label>
        <input
          defaultValue={`${fName || ""} ${lName || ""}`}
          required
          minLength={5}
          maxLength={30}
          type="text"
          name="cUsName"
          id="cUsName"
        />
        <label htmlFor="cUsEmail">Your Email: </label>
        <input
          defaultValue={email || ""}
          required
          minLength={5}
          maxLength={30}
          type="email"
          name="cUsEmail"
          id="cUsEmail"
        />
        <label htmlFor="cUsTopic">Your Name: </label>
        <select className={style.select} name="cUsTopic" id="cUsTopic">
          <option value="">-- Please Select --</option>
          <option value="Delivery">Delivery</option>
          <option value="Warranty">Warranty</option>
          <option value="Availability">Availability</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="cUsMessage">Message:</label>
        <textarea
          required
          minLength={10}
          maxLength={200}
          type="text"
          trim
          name="cUsMessage"
          id="cUsMessage"
        />
        <div className={style.privacy}>
          <input type="checkbox" name="privacy" id="privacy" />
          <label htmlFor="privacy">i have read and agree to tha </label>
          <Link href="?"> Privacy Policy</Link>
        </div>
        <button type="submit">Submit</button>
      </form>
    </Fragment>
  );
};

export default Contact;
