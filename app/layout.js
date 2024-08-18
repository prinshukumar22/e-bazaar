import { Inter } from "next/font/google";
import "./globals.css";
import CartLayout from "./CartLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-Bazaar",
  description: "Product Listing and Cart Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <CartLayout>
        <body className={inter.className}>{children}</body>
      </CartLayout>
    </html>
  );
}
