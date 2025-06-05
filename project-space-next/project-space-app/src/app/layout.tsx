"use client";
import { useState, useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainMenu from "@/components/MainMenu";
import http from "@/utils/http";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    http.get("/users/auth")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <MainMenu />
          <main className="container mx-auto px-4">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
