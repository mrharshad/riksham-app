import Link from "next/link";
import React from "react";
import style from "./service.module.css";
export const generateMetadata = () => {
  return {
    title: "Services",
  };
};
const Service = () => {
  return (
    <section id="productUser" className={style.section}>
      <h1>Service Information</h1>
      <Link href="/about-us">About-us</Link>
      <Link href="/disclaimer">Disclaimer</Link>
      <Link href="/shipping-return">Shipping & Return</Link>
      <Link href="/terms-conditions">Terms & Conditions</Link>
    </section>
  );
};

export default Service;
