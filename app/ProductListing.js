"use client";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "./context/cart-context";

export default function ProductListing() {
  const [products, setProducts] = useState(Array.from({ length: 10 }));
  const [loading, setLoading] = useState(false);
  const cartData = useCartContext();

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products?limit=10", { cache: "force-cache" })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data && data?.products) {
          setProducts(data.products);
          setLoading(false);
        } else {
          throw new Error("Some error occured");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="w-[100vw] min-h-[100vh] p-4 bg-[#1F74BA] flex flex-col">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center pb-2">
          <h1
            className=""
            style={{
              fontWeight: "900",
              fontSize: "1.8em",
              lineHeight: "1.5",
              color: "#fff",
            }}
          >
            Showing Cosmetics
          </h1>
          <Link
            href={"/cart"}
            className="go-to-cart mr-3 bg-[#fff] flex justify-center items-center p-2 pr-3 pl-3 whitespace-nowrap"
            style={{
              // border: "2px solid red",
              fontWeight: "600",
              fontSize: "1.2em",
              lineHeight: "1.5",
              borderRadius: "10px",
            }}
          >
            Go to Cart ({cartData.totalQty()})
          </Link>
        </div>
        <div className="flex items-center justify-around flex-wrap gap-4">
          {!loading &&
            products &&
            products.map((product, idx) => (
              <ProductCard
                key={idx}
                title={product?.title || ""}
                price={parseInt(product?.price * 80) || 0}
                image={product?.images[0] || ""}
                cartId={product?.id || ""}
                product={product}
                isLoading={loading}
              ></ProductCard>
            ))}
        </div>
      </div>
    </>
  );
}
