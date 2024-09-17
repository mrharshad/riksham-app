import React from "react";
import NewProductComponent from "./newProduct";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { verifyRole } from "@/backend/utils/tokenVerification";

export const generateMetadata = () => {
  return {
    title: "Create Product",
  };
};

const NewProduct = () => {
  const cookieStore = cookies();
  const value = cookieStore.get(process.env.COOKIE_TOKEN_NAME)?.value;
  const productInventoryManager = verifyRole(value, "p-general");
  if (!value || !productInventoryManager) {
    notFound();
  }
  return (
    <>
      <NewProductComponent token={value} />
    </>
  );
};

export default NewProduct;
