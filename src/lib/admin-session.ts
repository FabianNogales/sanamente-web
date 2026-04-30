import type { LoginUser } from "./api-client";

export const ADMIN_TOKEN_KEY = "sanamente.admin.token";
export const ADMIN_USER_KEY = "sanamente.admin.user";

export function saveAdminSession(token: string, user: LoginUser) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): LoginUser | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoginUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}
