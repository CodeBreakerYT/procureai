import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AssistantDock } from "@/components/assistant/AssistantDock";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProcureAI — AI-Powered Procurement Intelligence",
  description:
    "Analyze vendor proposals, uncover hidden risks, compare requirements, and find the best option — in minutes, with NOVA, your AI procurement assistant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AssistantDock />
      </body>
    </html>
  );
}
