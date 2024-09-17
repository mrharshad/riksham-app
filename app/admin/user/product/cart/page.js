"use client";
import Link from "next/link";

const ProductCarts = () => {
  return (
    <div
      style={{
        display: "flex",
        marginTop: "20px",
        width: "100%",
      }}
    >
      <Link
        style={{
          backgroundColor: "lightslategray",
          padding: "2px 20px",
          borderRadius: "5px",
          margin: "10px auto",
          borderRight: "1px solid aqua",
          borderLeft: "1px solid aqua",
          fontSize: "large",
          color: "white",
        }}
        href="cart/buy"
      >
        Process to buy
      </Link>
    </div>
  );
};

export default ProductCarts;
