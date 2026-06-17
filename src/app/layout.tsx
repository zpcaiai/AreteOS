import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Disclaimer from "@/components/Disclaimer";
import Providers from "@/components/Providers";
import ServiceWorker from "@/components/ServiceWorker";
import { cookies } from "next/headers";
import { getDict } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";

const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const serif = EB_Garamond({ subsets: ["latin"], display: "swap", weight: ["500", "600"], variable: "--font-serif" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arete.app";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getDict();
  const en = locale === "en";
  const brand = en ? "Arete — Human Development OS" : "Arete — 人类发展操作系统";
  const tagline = en ? "Become who you are." : "成为你本来所是的样子。";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: brand, template: "%s · Arete" },
    description: en
      ? "Arete — an operating system that helps people and the organizations they build move from potential to realized excellence (arete). Become who you are."
      : "Arete —— 一套帮助人与组织走向卓越(arete)的操作系统。成为你本来所是的样子。",
    applicationName: "Arete",
    keywords: ["Arete", "人类发展", "成长", "认知", "领导力", "Human Development OS"],
    openGraph: { title: brand, description: tagline, siteName: "Arete", type: "website", url: SITE_URL },
    twitter: { card: "summary", title: "Arete", description: tagline },
    robots: { index: true, follow: true },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, dict } = await getDict();
  const jar = await cookies();
  const theme = jar.get("theme")?.value === "light" ? "light" : "dark";
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} data-theme={theme} className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <ServiceWorker />
        <Providers>
          <I18nProvider locale={locale} dict={dict}>
            <div className="flex min-h-screen">
              <Sidebar />
              <main id="main" className="flex-1 overflow-y-auto p-5 lg:p-8">
                {children}
                <Disclaimer />
              </main>
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
