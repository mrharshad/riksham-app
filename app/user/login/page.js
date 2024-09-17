import { cookies } from "next/headers";
import { Fragment } from "react";
import LoginUser from "./login";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
};
const Login = () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (cookie) {
    return redirect("/");
  }
  return (
    <Fragment>
      <LoginUser Link={Link} />
    </Fragment>
  );
};

export default Login;
