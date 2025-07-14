import type { Metadata } from "next";
import { Anek_Latin} from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const anekLatin = Anek_Latin({
  variable: "--font-anek-latin",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "InvoSafe",
  description: "Safe & Secure Bill Processing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anekLatin.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
