import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Disclaimer from "@/components/Disclaimer";
import PageTransition from "@/components/PageTransition";
import CommandPalette from "@/components/CommandPalette";
import Providers from "@/components/Providers";
import ServiceWorker from "@/components/ServiceWorker";
import WebVitals from "@/components/WebVitals";
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
  const en = locale === "en";
  const jar = await cookies();
  const theme = jar.get("theme")?.value === "light" ? "light" : "dark";
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} data-theme={theme} className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Arete", url: SITE_URL, logo: `${SITE_URL}/icon-512.png` },
                { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Arete", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: locale === "zh" ? "zh-CN" : "en" },
                {
                  "@type": "SoftwareApplication",
                  name: "Arete",
                  applicationCategory: "LifestyleApplication",
                  operatingSystem: "Web",
                  url: SITE_URL,
                  description: en
                    ? "A human development OS — diagnose, prescribe, practice and compound toward excellence (arete)."
                    : "一套人类发展操作系统——诊断、处方、练习、复利,走向卓越(arete)。",
                  offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
                },
              ],
            }),
          }}
        />
        <a href="#main" className="skip-link">{en ? "Skip to content" : "跳到主要内容"}</a>
        <ServiceWorker />
        <WebVitals />
        <Providers>
          <I18nProvider locale={locale} dict={dict}>
            <CommandPalette />
            <div className="flex min-h-screen">
              <Sidebar />
              <main id="main" className="flex-1 overflow-y-auto p-5 lg:p-8">
                <div className="mx-auto w-full max-w-6xl">
                  <PageTransition>{children}</PageTransition>
                  <Disclaimer />
                </div>
              </main>
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
