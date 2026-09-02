export type FontSize = "small" | "normal" | "large" | "xlarge";

export const FONT_SIZES: FontSize[] = ["small", "normal", "large", "xlarge"];

const STORAGE_KEY = "lf-font-size";

export function getInitialFontSize(): FontSize {
  if (typeof window === "undefined") return "normal";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (FONT_SIZES.includes(saved as FontSize)) {
      return saved as FontSize;
    }
  } catch {
  }
  return "normal";
}

export function changeFontSize(
  current: FontSize,
  direction: "decrease" | "increase",
): FontSize {
  const currentIndex = FONT_SIZES.indexOf(current);
  const offset = direction === "increase" ? 1 : -1;
  const nextIndex = Math.max(
    0,
    Math.min(currentIndex + offset, FONT_SIZES.length - 1),
  );
  return FONT_SIZES[nextIndex];
}

export function applyFontSize(fontSize: FontSize): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-font-size", fontSize);
  try {
    localStorage.setItem(STORAGE_KEY, fontSize);
  } catch {
  }
}
