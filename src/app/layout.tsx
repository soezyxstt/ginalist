import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gina Listya Nuraini | Fashion Model",
  description: "Gina Listya Nuraini, professional fashion model based in Garut, West Java. Selected runway, editorial, beauty, lookbook, and fashion campaign work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
