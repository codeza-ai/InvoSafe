import type { Metadata } from "next";
import {Providers} from "@/components/Providers";
import "./globals.css";


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
        className="anek-latin antialiased"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
