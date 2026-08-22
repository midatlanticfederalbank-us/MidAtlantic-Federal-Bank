import "./globals.css";

export const metadata = {
  title: "MidAtlantic Federal Bank",
  description: "Real banking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
