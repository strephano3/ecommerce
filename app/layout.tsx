import type { Metadata } from "next";

import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "touch grass",
  description: "Abbigliamento essenziale firmato Touch Grass, pensato per uscire di casa con leggerezza.",
  metadataBase: new URL(siteUrl)
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
