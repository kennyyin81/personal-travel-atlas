import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我走过的地方",
  description: "个人旅行足迹、城市点亮地图与旅行照片档案。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
