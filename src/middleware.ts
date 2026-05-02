import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ja", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en prefix omitted for default locale
});

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
