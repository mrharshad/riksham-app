import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import style from "./layout.module.css";
import dynamic from "next/dynamic";
import { verify } from "jsonwebtoken";
export const metadata = {
  title: "User Accounts",
};
const Account = dynamic(() => import("./Account"), { ssr: false });
export default async function AccountLayout({ children }) {
  const DynamicChild = dynamic(
    () => import("../../../Layouts/dynamicChildren"),
    {
      ssr: false,
      loading: () => <p className={style.loading}>Loading...</p>,
    }
  );
  const value = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
  if (!value) {
    redirect("/user/login");
  }
  try {
    const { _id } = verify(value, process.env.JWT_SECRET_CODE);
  } catch (err) {
    if (!value) {
      redirect("/user/login");
    }
  }
  return (
    <section id="productUser" className={style.section}>
      <div className={style.mainDiv}>
        <DynamicChild children={children} />
        <Account />
      </div>
    </section>
  );
}
