import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AIAssistant } from "@/components/chat/ai-assistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tensure | AI-Driven Pipeline Design & ROI Estimator",
  description:
    "Generate intelligent 30-60-90 day deployment blueprints powered by AI agents and real-time infrastructure analysis. Enterprise DevOps modernization platform.",
  keywords: [
    "DevOps",
    "AI infrastructure",
    "CI/CD",
    "Kubernetes",
    "ROI estimator",
    "pipeline design",
  ],
  openGraph: {
    title: "Tensure | AI-Driven Pipeline Design & ROI Estimator",
    description:
      "Enterprise AI platform for deployment pipeline blueprints and ROI estimation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <AIAssistant />
      </body>
    </html>
  );
}
