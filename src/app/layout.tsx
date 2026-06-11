import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreHydrator } from "@/components/StoreHydrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthLens – Private Samsung Health Data Analyzer",
  description:
    "Analyze Samsung Health exports locally in your browser. Get private health insights, symptom patterns, data quality checks, and doctor-ready reports.",
  keywords: [
    "Samsung Health export analyzer",
    "Samsung Health dashboard",
    "health data insights",
    "local-first health app",
    "doctor report from Samsung Health"
  ],
  openGraph: {
    title: "HealthLens – Private Samsung Health Data Analyzer",
    description:
      "Analyze Samsung Health exports locally in your browser. Get private health insights, symptom patterns, and doctor-ready summaries without server upload.",
    type: "website",
    siteName: "HealthLens",
    images: [
      {
        url: "/docs/assets/overview.png",
        width: 1200,
        height: 630,
        alt: "HealthLens Dashboard Overview"
      }
    ]
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
