import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/ui/providers";
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: "Urbannest",
  description: "A property management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="satoshi antialiased">
        <Providers>
          <Toaster />
          <main className=" h-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
