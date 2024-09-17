import React, { Fragment } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

export const metadata = {
  title: "Order",
};
const page = async ({ searchParams }) => {
  const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
  const { id, item, status } = searchParams;
  if (
    (!token || ["newOrder", "delivered", "canceled"].includes(status) || !id,
    !item)
  )
    return redirect("orders");

  const DynamicClient = dynamic(() => import("./order"), {
    ssr: false,
  });

  return (
    <section
      style={{
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      id="productUser"
    >
      <DynamicClient id={id} item={item} status={status} />
    </section>
  );
};

export default page;
