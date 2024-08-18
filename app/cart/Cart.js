"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "../context/cart-context";
import Link from "next/link";
import DiscountModal from "../components/DiscountModal";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useState } from "react";

export default function Cart() {
  const cartData = useCartContext();
  console.log(cartData);
  const cart = cartData.cart;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const { width, height } = useWindowSize();

  const discounts = [
    { code: "SAVE10", value: 10 },
    { code: "SAVE20", value: 20 },
    { code: "SAVE30", value: 30 },
  ];

  const getEligibleDiscounts = () => {
    const total = calculateSubtotal();
    if (total < 500) {
      return [];
    } else if (total < 1000) {
      return discounts.filter((discount) => discount.value === 10);
    } else if (total < 1500) {
      return discounts.filter((discount) => discount.value <= 20);
    } else {
      return discounts;
    }
  };

  const applyDiscount = (discount) => {
    const total = calculateSubtotal();
    if (total < 500) {
      toast.error("You need to shop for at least ₹500 to apply a discount.");
      return;
    }
    setSelectedDiscount(discount);
    setIsModalOpen(false);
    setDiscountApplied(true);

    setTimeout(() => {
      setDiscountApplied(false);
    }, 4000);
  };

  const updateQuantity = (id, amount) => {
    cartData.updateQuantity(id, amount);
    // setCart(
    //   (prevCart) =>
    //     prevCart
    //       .map((item) =>
    //         item.id === id
    //           ? { ...item, quantity: item.quantity + amount }
    //           : item
    //       )
    //       .filter((item) => item.quantity > 0) // Filter out items with quantity <= 0
    // );
  };

  const removeItem = (id) => {
    cartData.removeItem(id);
    // setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const finalTotal = () => {
    const total = calculateSubtotal();
    const ftotal = selectedDiscount
      ? total - (total * selectedDiscount.value) / 100
      : total;
    return ftotal;
  };

  const handleCheckout = () => {
    // Trigger the toast notification
    toast.success("Product ordered successfully!");
    // You can add more logic here for checkout processing
    cartData.removeAll();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6  text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-700">
            No products in the cart
          </h2>
          <p className="text-gray-500 mt-4">
            Browse our products and add them to your cart!
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600"
          >
            Go Back to Home
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Product List */}
          <div className="flex-1">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 mx-4">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">₹{parseInt(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="red"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="feather feather-trash-2"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-2 14H7L5 6"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M21 4H8l-1-2H4"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 lg:mt-0 w-full lg:w-1/3">
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              {selectedDiscount && (
                <p className="text-lg text-green-600">
                  Discount Applied: {selectedDiscount.code} -{" "}
                  {selectedDiscount.value}% off
                </p>
              )}
              <p className="text-lg font-semibold mt-2">
                Total: ₹{parseInt(finalTotal())}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 mb-2 mt-2"
              >
                Apply Discount
              </button>
              <button
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <DiscountModal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-semibold mb-4">Select a Discount</h2>
          <ul>
            {getEligibleDiscounts().map((discount) => (
              <li
                key={discount.code}
                onClick={() => applyDiscount(discount)}
                className="cursor-pointer mb-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {discount.code} - {discount.value}% off
              </li>
            ))}
          </ul>
        </DiscountModal>
      )}
      {discountApplied && <Confetti width={width} height={height} />}
    </div>
  );
}
