import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SeasonProvider } from "@/context/SeasonContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import "../globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

// ─── Locale-aware metadata ────────────────────────────────────────────────────

const META = {
  en: {
    title: "Hokkaido Elite Club — Private Mountain Guiding",
    description:
      "Hokkaido's premier private guiding service. Expert-led powder tours in winter, sea kayaking and alpine trekking in summer. Niseko, Kiroro, Shakotan Peninsula.",
    ogLocale: "en_US",
  },
  ja: {
    title: "北海道エリートクラブ — プライベート山岳ガイド",
    description:
      "北海道最高峰のプライベートガイドサービス。冬はパウダースキー、夏はシーカヤック・アルペントレッキング。ニセコ、キロロ、積丹半島。",
    ogLocale: "ja_JP",
  },
  zh: {
    title: "北海道精英俱乐部 — 私人山地向导",
    description:
      "北海道顶级私人向导服务。冬季深粉滑雪之旅，夏季海上皮划艇与高山徒步。倶知安、积丹半岛。",
    ogLocale: "zh_CN",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (params.locale as keyof typeof META) in META
    ? (params.locale as keyof typeof META)
    : "en";

  const m = META[locale];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hokkaidoeliteclub.com";

  return {
    title: {
      default: m.title,
      template: `%s | Hokkaido Elite Club`,
    },
    description: m.description,
    keywords: [
      "Hokkaido",
      "private ski guiding",
      "Niseko",
      "Kiroro",
      "backcountry",
      "powder",
      "sea kayaking",
      "Shakotan",
      "Daisetsuzan",
      "alpine trekking",
      "luxury guiding",
      "Japan skiing",
    ],
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "en": `${siteUrl}/en`,
        "ja": `${siteUrl}/ja`,
        "zh": `${siteUrl}/zh`,
      },
    },
    openGraph: {
      title: "Hokkaido Elite Club",
      description: m.description,
      siteName: "Hokkaido Elite Club",
      url: `${siteUrl}/${locale}`,
      locale: m.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hokkaido Elite Club",
      description: m.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="bg-obsidian text-stark antialiased">
        <NextIntlClientProvider messages={messages}>
          <SeasonProvider>
            <CheckoutProvider>
              {children}
            </CheckoutProvider>
          </SeasonProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
