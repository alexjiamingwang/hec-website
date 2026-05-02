import { getLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { ServicesSection } from "@/components/services";
import { TeamSection } from "@/components/team";
import { GallerySection } from "@/components/gallery";
import { CheckoutModal } from "@/components/checkout";
import type { Locale } from "@/types";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div className="grain">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar locale={locale as Locale} />

      {/* ── Step 2: Hero ───────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Step 3: Services + Rate Calculator ─────────────────────────────── */}
      <ServicesSection />

      {/* ── Step 4: Guiding Team + Guide Modal + Calendar ──────────────────── */}
      <TeamSection />

      {/* ── Step 5: Gallery — Infinite Scroll ──────────────────────────────── */}
      <GallerySection />

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-slate-dark">
            Hokkaido Elite Club — Est. 2024
          </p>
          <p className="font-mono text-xs text-slate-dark">
            © {new Date().getFullYear()} HEC. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Step 6: Checkout / Intake Modal ────────────────────────────────── */}
      <CheckoutModal />
    </div>
  );
}
