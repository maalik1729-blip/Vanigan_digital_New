/**
 * Accessibility utilities for WCAG AA compliance
 */

/**
 * Creates a descriptive ARIA label for actions
 * @param action - The action being performed (e.g., "Download", "Edit", "Delete")
 * @param item - Optional item being acted upon (e.g., "certificate", "membership")
 * @returns A complete ARIA label string
 */
export function createAriaLabel(action: string, item?: string): string {
  return item ? `${action} ${item}` : action;
}

/**
 * Handles keyboard navigation for interactive elements
 * @param event - The keyboard event
 * @param callback - Function to call when Enter or Space is pressed
 */
export function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

/**
 * Focus trap for modals and dialogs
 * @param containerRef - Reference to the container element
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, [containerRef]);
}

/**
 * Announces messages to screen readers
 * @param message - The message to announce
 * @param politeness - The ARIA live region politeness level
 */
export function announceToScreenReader(
  message: string,
  politeness: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", politeness);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Validates color contrast ratio (WCAG AA requires 4.5:1 for normal text)
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @returns Whether the contrast ratio meets WCAG AA standards
 */
export function meetsContrastRatio(
  foreground: string,
  background: string
): boolean {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio >= 4.5;
}

// Import React for type definitions
import * as React from "react";
