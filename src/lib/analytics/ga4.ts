export function getGaMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
}

export function isGaEnabled(measurementId = getGaMeasurementId()) {
  return /^G-[A-Z0-9]+$/i.test(measurementId);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackGaPageView(url: string, measurementId = getGaMeasurementId()) {
  if (!isGaEnabled(measurementId) || typeof window.gtag !== "function") return;
  window.gtag("config", measurementId, { page_path: url });
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isGaEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
