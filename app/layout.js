import "./globals.css";

export const metadata = {
  title: "MIDATLANTIC FEDERAL BANK",
  description: "Customer banking portal",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
