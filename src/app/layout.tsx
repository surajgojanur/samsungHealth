import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreHydrator } from "@/components/StoreHydrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthLens — Samsung Health Insights",
  description:
    "Turn your Samsung Health export into a private, local-first dashboard with insights, symptom patterns, data-quality checks, and doctor-ready reports.",
  openGraph: {
    title: "HealthLens — Private Samsung Health Insights",
    description:
      "Analyze Samsung Health exports locally in your browser. Get plain-language insights, symptom timelines, and doctor-ready summaries without server upload by default.",
    type: "website",
    siteName: "HealthLens"
  }
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
