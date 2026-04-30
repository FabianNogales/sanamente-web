"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, type LoginUser } from "@/lib/api-client";
import { clearAdminSession, getAdminToken } from "@/lib/admin-session";

type AdminGuardState = {
  loading: boolean;
  token: string | null;
  user: LoginUser | null;
};

export function useAdminGuard() {
  const router = useRouter();
  const [state, setState] = useState<AdminGuardState>({
    loading: true,
    token: null,
    user: null,
  });

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const token = getAdminToken();
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const profile = await apiRequest<LoginUser>("/users/profile", {
          method: "GET",
          token,
        });

        if (profile.role !== "ADMIN") {
          clearAdminSession();
          router.replace("/admin/login");
          return;
        }

        if (!active) return;
        setState({ loading: false, token, user: profile });
      } catch {
        clearAdminSession();
        router.replace("/admin/login");
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [router]);

  return state;
}
