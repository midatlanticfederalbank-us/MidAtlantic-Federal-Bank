import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "MidAtlantic Federal Bank",
  description: "Banking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
