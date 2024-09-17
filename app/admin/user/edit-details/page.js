import { Fragment } from "react";
import EditAccount from "./editAccount";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Edit User Details",
};

const EditAccountPage = async ({ searchParams }) => {
  const cookieStore = cookies();
  const value = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  const validation = cookieStore.get("userInfoRevalidate")?.value;
  if (!value) {
    redirect("/user/sign-up");
  }
  const user = await fetch(
    `${
      process.env.PROTOCOL_AND_HOST
    }/api/admin/user/account?token=${value}&validation=${
      validation || "newData"
    }`,
    // { cache: "no-cache" }
    { next: { revalidate: 21600 } }
  );
  const { success, message, data } = await user.json();
  if (message) {
    redirect("/user/login");
  }
  return (
    <Fragment>
      <EditAccount user={data} token={value} Link={Link} query={searchParams} />
    </Fragment>
  );
};

export default EditAccountPage;
