import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paris Student Life Map",
  description: "A district-level student life quality overlay for Paris and nearby western suburbs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
