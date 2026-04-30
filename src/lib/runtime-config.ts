function normalizeBaseUrl(value: string | undefined, fallback: string) {
  return (value ?? fallback).replace(/\/$/, "");
}

export const WEB_APP_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000");
export const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL, "http://localhost:4000");
export const MOBILE_APP_URL = process.env.NEXT_PUBLIC_MOBILE_APP_URL ?? "https://app.sanamente.app/#descargar";
