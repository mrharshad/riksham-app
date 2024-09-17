"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Close({ searchParams }) {
  const router = useRouter();
  const { fName, lName, mobileNo } = searchParams;
  const data = useSelector((data) => data.user).data;
  const [load, setLoad] = useState();
  // useEffect(() => {
  //   setLoad(true);
  // }, []);

  return <h3>Close Your Account</h3>;
}
