import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/app/components/shared/ToastProvider";

export const metadata: Metadata = {
  title: "RentNest - Rental Property Platform",
  description: "Find and manage rental properties effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-white">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
