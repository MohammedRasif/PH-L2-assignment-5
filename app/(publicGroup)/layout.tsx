import React from "react";
import Navbar from "@/app/components/shared/navbar";
import Footer from "@/app/components/shared/footer";
import { getMe } from "@/app/service/getMe";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar user={user} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}