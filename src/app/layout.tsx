import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreHydrator } from "@/components/StoreHydrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthLens",
  description: "Private Samsung Health export dashboard and doctor report."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreHydrator />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

