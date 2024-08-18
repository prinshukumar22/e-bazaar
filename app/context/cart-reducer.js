export const cartReducer = (state, action) => {
  if (action.type === "ADD_TO_CART") {
    const { id, price, image, title, product } = action.payload;
    console.log(action.payload);
    let cartproduct = {
      id,
      name: title,
      price: price,
      image: image,
      quantity: 1,
    };

    let oldCart = [...state.cart];
    let newCart = oldCart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    let exist = oldCart.find((item) => item.id === id);
    if (exist) {
      console.log(newCart);
      return {
        ...state,
        cart: newCart,
      };
    } else {
      newCart.push(cartproduct);
      console.log(newCart);
      return {
        ...state,
        cart: newCart,
      };
    }
  } else if (action.type === "UPDATE") {
    const { id, amount } = action.payload;
    let prevCart = [...state.cart];
    let newCart = prevCart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      )
      .filter((item) => item.quantity > 0);
    return { ...state, cart: newCart };
  } else if (action.type === "REMOVE") {
    const id = action.payload;
    let prevCart = [...state.cart];
    let newCart = prevCart.filter((item) => item.id !== id);
    return { ...state, cart: newCart };
  }

  return state;
};
