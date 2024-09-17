import dynamic from "next/dynamic";

export const metadata = {
  title: "Cart Product",
};
const ProductCarts = ({ children }) => {
  const CartClient = dynamic(() => import("./cartClient"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
  });
  return (
    <section style={{ backgroundColor: "black" }} id="productUser">
      <CartClient children={children} />;
    </section>
  );
};

export default ProductCarts;
