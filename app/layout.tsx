import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/shared/navbar";
import Footer from "@/app/components/shared/footer";
import { getMe } from "@/app/service/getMe";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();

  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar user={user} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


