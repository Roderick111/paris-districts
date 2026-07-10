import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "District Quality Map",
  description:
    "Compare district quality across French cities using safety, rent pressure, transport, services, access, energy, and calm."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
