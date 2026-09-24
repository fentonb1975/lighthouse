import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Robot",
  description: "Spin a hand-drawn robot on its turntable.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
