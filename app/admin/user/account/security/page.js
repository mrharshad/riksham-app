"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const router = useRouter();

  const { fName, lName, mobileNo } = useSelector((data) => data.user).data;
  return (
    <>
      <h3>Password & Verification</h3>
    </>
  );
};

export default page;
