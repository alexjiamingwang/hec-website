"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCheckout } from "@/context/CheckoutContext";

// ─────────────────────────────────────────────────────────────────────────────

type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface FormState {
  name: string;
  email: string;
  whatsapp: string;
  skillLevel: SkillLevel;
  notes: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  whatsapp: "",
  skillLevel: "intermediate",
  notes: "",
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function CheckoutModal() {
  const t = useTranslations("checkout");
  const { isOpen, selectedRate, selectedGuide, closeCheckout } = useCheckout();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setSubmitted(false);
    }
  }, [isOpen]);

  // Close on Escape + lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCheckout(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCheckout]);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--surface-3)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCheckout}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-lg z-50 flex flex-col overflow-y-auto"
            style={{
              background: "var(--surface-1)",
              borderLeft: "1px solid var(--border-subtle)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Close button */}
            <button
              onClick={closeCheckout}
              className="absolute top-5 right-5 z-10 p-2 transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="p-8 flex flex-col gap-8 flex-1">

              {/* Title */}
              <div>
                <span className="hec-divider mb-4 block" />
                <h2
                  className="font-display text-3xl italic"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("title")}
                </h2>
                {selectedGuide && (
                  <p
                    className="font-mono text-xs tracking-widest uppercase mt-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    With {selectedGuide}
                  </p>
                )}
              </div>

              {/* Pre-populated rate summary */}
              {selectedRate && (
                <div
                  className="p-5"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-subtle)",
                    borderLeft: "2px solid var(--season-accent)",
                  }}
                >
                  <p
                    className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Selected Rate
                  </p>
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedRate.areaLabel}
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {selectedRate.breakdown}
                  </p>
                  <div className="flex items-baseline gap-6">
                    <div>
                      <span
                        className="font-mono text-[0.55rem] uppercase tracking-wider block mb-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Total
                      </span>
                      <span
                        className="font-display text-2xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ¥{selectedRate.total.toLocaleString("en-US")}
                      </span>
                    </div>
                    <div>
                      <span
                        className="font-mono text-[0.55rem] uppercase tracking-wider block mb-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Deposit (30%)
                      </span>
                      <span
                        className="font-display text-2xl"
                        style={{ color: "var(--season-accent)" }}
                      >
                        ¥{selectedRate.deposit.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Form ────────────────────────────────────────────────────── */}
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                  <Field label={t("name")}>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      style={inputStyle}
                      placeholder="Your full name"
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--season-accent)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </Field>

                  <Field label={t("email")}>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      style={inputStyle}
                      placeholder="you@example.com"
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--season-accent)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </Field>

                  <Field label={t("whatsapp")}>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={set("whatsapp")}
                      style={inputStyle}
                      placeholder="+1 234 567 8900"
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--season-accent)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </Field>

                  <Field label={t("skillLevel")}>
                    <div className="relative">
                      <select
                        value={form.skillLevel}
                        onChange={set("skillLevel")}
                        style={{ ...inputStyle, appearance: "none", paddingRight: "2.5rem", cursor: "pointer" } as React.CSSProperties}
                        onFocus={e => (e.currentTarget.style.borderColor = "var(--season-accent)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                      >
                        <option value="beginner">{t("beginner")}</option>
                        <option value="intermediate">{t("intermediate")}</option>
                        <option value="advanced">{t("advanced")}</option>
                        <option value="expert">{t("expert")}</option>
                      </select>
                      <span
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >▾</span>
                    </div>
                  </Field>

                  <Field label={t("notes")}>
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
                      placeholder={t("notesPlaceholder")}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--season-accent)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                    />
                  </Field>

                  {/* Actions */}
                  <div
                    className="mt-auto pt-5 flex flex-col gap-3"
                    style={{ borderTop: "1px solid var(--border-subtle)" }}
                  >
                    {/* Pay deposit — Square link placeholder */}
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="w-full py-4 px-6 font-mono text-xs tracking-[0.2em] uppercase text-center transition-opacity duration-200 hover:opacity-90"
                      style={{
                        background: "var(--season-accent)",
                        color: "var(--surface-1)",
                        display: "block",
                      }}
                    >
                      {t("deposit")}
                    </a>

                    <p
                      className="font-mono text-[0.6rem] text-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("depositNote")}
                    </p>

                    {/* Send inquiry */}
                    <button
                      type="submit"
                      className="w-full py-4 px-6 font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300"
                      style={{
                        border: "1px solid var(--border-mid)",
                        color: "var(--text-secondary)",
                        background: "transparent",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--season-accent)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-mid)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                      }}
                    >
                      {t("submit")}
                    </button>

                    <p
                      className="font-mono text-[0.55rem] text-center tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t("privacy")}
                    </p>
                  </div>
                </form>
              ) : (
                /* ── Success state ──────────────────────────────────────────── */
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-12"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-4xl" style={{ color: "var(--season-accent)" }}>✦</span>
                  <h3
                    className="font-display text-2xl italic"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Inquiry Received
                  </h3>
                  <p
                    className="text-sm max-w-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Thank you. A member of the HEC team will be in touch within 24 hours.
                  </p>
                  <button
                    onClick={closeCheckout}
                    className="font-mono text-xs tracking-widest uppercase mt-4 transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
