import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "MIDATLANTIC FEDERAL BANK",
  description: "Customer banking demonstration application",
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
