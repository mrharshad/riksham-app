import React, { Fragment } from "react";
import Recovery from "./recovery";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const page = async ({ searchParams }) => {
  const token = searchParams.key;
  const email = searchParams.email;

  const cookieStore = cookies();

  const loggedIn = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (loggedIn || !token || !email) {
    redirect("/");
  }
  return (
    <Fragment>
      <Recovery token={token} email={email} />
    </Fragment>
  );
};

export default page;
