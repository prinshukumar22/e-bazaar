import { createContext, useReducer, useContext } from "react";
import { cartReducer } from "./cart-reducer";

const CartContext = createContext();

const initialState = {
  cart: [],
};

// {
//   id: 3,
//   name: "Product 1",
//   price: 29.99,
//   quantity: 1,
//   image: "https://via.placeholder.com/150",
// },
// {
//   id: 4,
//   name: "Product 2",
//   price: 49.99,
//   quantity: 2,
//   image: "https://via.placeholder.com/150",
// },

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (id, price, image, title, product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: id,
        price: price,
        image: image,
        title: title,
        product: product,
      },
    });
  };

  const updateQuantity = (id, amount) => {
    dispatch({
      type: "UPDATE",
      payload: { id, amount },
    });
  };

  const removeItem = (id) => {
    dispatch({
      type: "REMOVE",
      payload: id,
    });
  };

  const totalQty = () => {
    const total = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    return total;
  };

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, updateQuantity, removeItem, totalQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartProvider;
