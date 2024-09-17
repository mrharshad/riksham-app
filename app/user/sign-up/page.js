import React, { Fragment } from "react";
import SignUpComponent from "./signUp";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sing Up",
};

function signUp() {
  const cookieStore = cookies();
  const loggedIn = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (loggedIn) {
    redirect("/");
  }

  return (
    <Fragment>
      <SignUpComponent Link={Link} />
    </Fragment>
  );
}

export default signUp;
