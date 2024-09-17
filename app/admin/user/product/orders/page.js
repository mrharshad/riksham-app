import React, { Fragment } from "react";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
export const metadata = {
  title: "Product Orders",
};
const page = async () => {
  const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
  const DynamicClient = dynamic(() => import("./orders"), {
    ssr: false,
  });
  if (!token) {
    return redirect("/user/login");
  }

  return (
    <section
      style={{ backgroundColor: "black", color: "white" }}
      id="productUser"
    >
      <DynamicClient />
    </section>
  );
};

export default page;
