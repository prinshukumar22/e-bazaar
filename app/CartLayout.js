"use client";
import CartProvider from "./context/cart-context";
const CartLayout = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default CartLayout;
