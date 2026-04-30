import { API_BASE_URL } from "./runtime-config";
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from "./admin-session";

export type LoginUser = {
  id: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};

export type LoginResponse = {
  access_token: string;
  user: LoginUser;
};

type ApiRequestOptions = RequestInit & {
  token?: string;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function normalizeMessage(payload: unknown, status: number) {
  const fallback = `HTTP ${status}`;
  if (payload == null) return fallback;

  if (typeof payload === "string") {
    const trimmed = payload.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof payload === "object") {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  return fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const hasFormDataBody = typeof FormData !== "undefined" && rest.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasFormDataBody ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  let payload: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  } else {
    payload = await response.text().catch(() => "");
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    }
    const err = new Error(normalizeMessage(payload, response.status)) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  return payload as T;
}

export function buildQueryString(query: Record<string, string | number | boolean | null | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    if (typeof value === "number" && !Number.isFinite(value)) return;
    params.set(key, String(value));
  });
  const raw = params.toString();
  return raw.length > 0 ? `?${raw}` : "";
}

export function withBaseUrl(path: string) {
  return buildUrl(path);
}
