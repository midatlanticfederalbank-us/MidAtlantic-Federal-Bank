import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "MidAtlantic Federal Bank",
  description: "Real banking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
