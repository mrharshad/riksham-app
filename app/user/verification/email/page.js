import React, { Fragment } from "react";
import Verification from "./verification";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Email Verification ",
};

function signUp() {
  const cookieStore = cookies();
  const loggedIn = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (loggedIn) {
    redirect("/");
  }
  let data = cookieStore.get("newAccount")?.value;
  if (!data) {
    redirect("/user/sign-up");
  }
  try {
    data = JSON?.parse(data);
  } catch {
    return redirect("/");
  }

  return (
    <Fragment>
      <Verification firstStep={data} />
    </Fragment>
  );
}

export default signUp;
