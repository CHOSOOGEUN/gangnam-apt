import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://gangnam-apt.vercel.app"),
  title: "내 월급으로 강남 아파트 사려면? 😱",
  description:
    "밥도 안 먹고, 한 푼도 안 쓰고 저축만 한다면 강남 아파트 살 수 있을까? 지금 계산해보세요.",
  openGraph: {
    title: "내 월급으로 강남 아파트 사려면? 😱",
    description: "밥도 안 먹고 저축만 하면 강남 아파트 살 수 있을까?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "내 월급으로 강남 아파트 사려면? 😱",
    description: "밥도 안 먹고 저축만 하면 강남 아파트 살 수 있을까?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
