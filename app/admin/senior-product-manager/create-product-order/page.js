import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Client from "./clientComponent";

export const metadata = {
  title: "Create Product Order Manually",
};
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_CODE);
  } catch {
    return null;
  }
};

const CreateProductOrderManually = async () => {
  const token = cookies().get(process.env.COOKIE_TOKEN_NAME)?.value;
  const result = decodeToken(token);
  if (!result || !result?.role.includes("Senior Product Manager")) {
    redirect("/");
  }

  return <Client token={token} />;
};

export default CreateProductOrderManually;
