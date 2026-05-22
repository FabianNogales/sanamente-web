function normalizeBaseUrl(value: string | undefined, fallback?: string) {
  const rawValue = value ?? fallback;
  
  console.log("Normalizing base URL:", { value, fallback, rawValue });

  if (!rawValue) {
    throw new Error("Missing required public env var: NEXT_PUBLIC_API_URL");
  }

  return rawValue.replace(/\/$/, "");
}

const isProduction = process.env.NODE_ENV === "production";

export const WEB_APP_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  isProduction ? undefined : "http://localhost:3000"
);

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL,
  isProduction ? undefined : "http://localhost:4000"
);

export const MOBILE_APP_URL =
  process.env.NEXT_PUBLIC_APK_URL ?? "";