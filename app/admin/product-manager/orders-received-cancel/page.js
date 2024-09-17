import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import jwt from "jsonwebtoken";
import dynamic from "next/dynamic";
export const metadata = {
  title: "Product Order Received / Cancel",
};

const OrderReceivedCancel = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (!token) {
    return notFound();
  }

  try {
    const role = jwt.verify(token, process.env.JWT_SECRET_CODE).role;
    if (!role.includes("product-manager")) return notFound();
  } catch (err) {
    return notFound();
  }
  const ClientSide = dynamic(() => import("./client"), { ssr: false });
  return <ClientSide />;
};

export default OrderReceivedCancel;
