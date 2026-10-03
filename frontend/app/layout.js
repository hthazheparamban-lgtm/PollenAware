import "./globals.css";

export const metadata = {
  title: "PollenAware",
  description: "Personalised allergy monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}