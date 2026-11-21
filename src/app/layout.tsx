import type { Metadata } from "next";
import { Suspense } from "react";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { TopBar } from "@/components/homepage/top-bar";
import { Navbar } from "@/components/homepage/navbar";
import { Footer } from "@/components/homepage/footer";
import { CartProvider } from "@/components/cart-provider";
import { PageFade } from "@/components/motion/page-fade";

const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const instant = false;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Streetwear dari Seller Independen`,
    template: `% | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["streetwear", "fashion", "marketplace", "seller independen", "drop", "sneakers", "hoodie"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Streetwear dari Seller Independen`,
    description: SITE_DESCRIPTION,
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={null}>
          <CartProvider>
            <TopBar />
            <Navbar />
            <main className="flex-1">
              <PageFade>{children}</PageFade>
            </main>
            <Footer />
          </CartProvider>
        </Suspense>
      </body>
    </html>
  );
}
