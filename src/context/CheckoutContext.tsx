"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { RateResult } from "../../data/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────
type SelectedRate = RateResult & { locationName?: string };

interface CheckoutOptions {
  rate?: SelectedRate;
  guide?: string;
}

interface CheckoutContextValue {
  isOpen: boolean;
  selectedRate?: SelectedRate;
  selectedGuide?: string;
  openCheckout: (opts?: CheckoutOptions) => void;
  closeCheckout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CheckoutContext = createContext<CheckoutContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<SelectedRate | undefined>();
  const [selectedGuide, setSelectedGuide] = useState<string | undefined>();

  const openCheckout = useCallback((opts?: CheckoutOptions) => {
    setSelectedRate(opts?.rate);
    setSelectedGuide(opts?.guide);
    setIsOpen(true);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
    // Clear state after close animation
    setTimeout(() => {
      setSelectedRate(undefined);
      setSelectedGuide(undefined);
    }, 350);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{ isOpen, selectedRate, selectedGuide, openCheckout, closeCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within <CheckoutProvider>");
  return ctx;
}
