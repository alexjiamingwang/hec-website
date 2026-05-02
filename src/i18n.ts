import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ja", "zh"] as const;
type SupportedLocale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: SupportedLocale = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as SupportedLocale)
    : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
