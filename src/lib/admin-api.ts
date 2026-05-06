import { apiRequest, buildQueryString } from "./api-client";
import type {
  AdminConfigPayload,
  AdminDepositRecord,
  AdminPackage,
  AdminPaginated,
  AdminProfessionalRecord,
  AdminReferralRecord,
  AdminReferralsResponse,
  AdminSpecialty,
  AdminStatsResponse,
  AdminUserRecord,
  AdminWithdrawalRecord,
  BonusTier,
  PromotionalGrantRecord,
} from "./admin-types";

const DEFAULT_REFERRALS_PAGE = 1;
const DEFAULT_REFERRALS_LIMIT = 20;
const MIN_PAGE = 1;
const MAX_PAGE = Number.MAX_SAFE_INTEGER;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

function normalizeInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const asInt = Math.trunc(parsed);
  if (asInt < min) return min;
  if (asInt > max) return max;
  return asInt;
}

export async function getAdminStats(token: string): Promise<AdminStatsResponse> {
  return apiRequest<AdminStatsResponse>("/admin/stats", { method: "GET", token });
}

export async function getAdminClients(
  token: string,
  search?: string,
  cursor?: string,
  limit = 20,
  billingRegion?: "BOLIVIA" | "INTERNATIONAL",
): Promise<AdminPaginated<AdminUserRecord>> {
  const query = buildQueryString({ search, cursor, limit, billingRegion });
  const response = await apiRequest<{ data?: AdminUserRecord[]; nextCursor?: string | null }>(`/admin/clients${query}`, {
    method: "GET",
    token,
  });
  return {
    data: Array.isArray(response.data) ? response.data : [],
    nextCursor: response.nextCursor ?? null,
  };
}

export async function getAdminClientById(token: string, id: string): Promise<AdminUserRecord> {
  return apiRequest<AdminUserRecord>(`/admin/clients/${encodeURIComponent(id)}`, { method: "GET", token });
}

export async function updateAdminClientStatus(token: string, id: string, isActive: boolean) {
  return apiRequest(`/admin/clients/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ isActive }),
  });
}

export async function getAdminProfessionals(
  token: string,
  search?: string,
  cursor?: string,
  limit = 20,
): Promise<AdminPaginated<AdminProfessionalRecord>> {
  const query = buildQueryString({ search, cursor, limit });
  const response = await apiRequest<{ data?: any[]; nextCursor?: string | null }>(`/admin/professionals${query}`, {
    method: "GET",
    token,
  });
  const rows = Array.isArray(response.data) ? response.data : [];
  return {
    data: rows.map((row) => ({
      ...row,
      professionalProfile: row?.professionalProfile ?? null,
      wallet: row?.wallet ?? null,
    })) as AdminProfessionalRecord[],
    nextCursor: response.nextCursor ?? null,
  };
}

export async function getAdminProfessionalById(token: string, id: string): Promise<AdminProfessionalRecord> {
  return apiRequest<AdminProfessionalRecord>(`/admin/professionals/${encodeURIComponent(id)}`, { method: "GET", token });
}

export async function editAdminProfessional(
  token: string,
  id: string,
  payload: { phoneNumber?: string; username?: string; bio?: string; rateCredits?: number; email?: string },
) {
  return apiRequest(`/admin/professionals/${encodeURIComponent(id)}/edit`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProfessionalProfile(
  token: string,
  id: string,
  payload: { firstName?: string; lastName?: string; username?: string; bio?: string },
) {
  return apiRequest(`/admin/professionals/${encodeURIComponent(id)}/profile`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProfessionalStatus(token: string, id: string, isActive: boolean) {
  return apiRequest(`/admin/professionals/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ isActive }),
  });
}

export async function getAdminProfessionalStats(token: string, id: string) {
  return apiRequest(`/admin/stats/professional/${encodeURIComponent(id)}`, { method: "GET", token });
}

export async function getAdminPendingWithdrawalRequests(
  token: string,
  search?: string,
  cursor?: string,
  limit = 20,
): Promise<AdminPaginated<AdminWithdrawalRecord>> {
  const query = buildQueryString({ search, cursor, limit });
  const response = await apiRequest<{ data?: any[]; nextCursor?: string | null }>(
    `/admin/professionals/list/withdrawal-requests${query}`,
    { method: "GET", token },
  );
  const rows = Array.isArray(response.data) ? response.data : [];
  return {
    data: rows.map((row) => ({
      ...row,
      amountBs: Number(row?.amountBs ?? row?.soles ?? 0),
    })),
    nextCursor: response.nextCursor ?? null,
  };
}

export async function getAdminWithdrawalHistory(
  token: string,
  search?: string,
  cursor?: string,
  limit = 20,
): Promise<AdminPaginated<AdminWithdrawalRecord>> {
  const query = buildQueryString({ search, cursor, limit });
  const response = await apiRequest<{ data?: any[]; nextCursor?: string | null }>(
    `/admin/professionals/payment/history${query}`,
    { method: "GET", token },
  );
  const rows = Array.isArray(response.data) ? response.data : [];
  return {
    data: rows.map((row) => ({
      ...row,
      amountBs: Number(row?.amountBs ?? row?.soles ?? 0),
    })),
    nextCursor: response.nextCursor ?? null,
  };
}

export async function updateAdminWithdrawalStatus(
  token: string,
  id: string,
  payload: {
    status: "APPROVED" | "REJECTED";
    rejectionReason?: string;
    notes?: string;
    receipt?: { file: File };
  },
) {
  const form = new FormData();
  form.append("status", payload.status);
  if (payload.rejectionReason) form.append("rejectionReason", payload.rejectionReason);
  if (payload.notes) form.append("notes", payload.notes);
  if (payload.receipt?.file) form.append("receipt", payload.receipt.file);

  return apiRequest(`/admin/payment-requests/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: form,
  });
}

export async function getAdminDeposits(
  token: string,
  search?: string,
  cursor?: string,
  limit = 20,
): Promise<{ requests: AdminDepositRecord[]; nextCursor: string | null }> {
  const query = buildQueryString({ search, cursor, limit });
  const response = await apiRequest<{ requests?: any[]; nextCursor?: string | null }>(`/admin/deposits${query}`, {
    method: "GET",
    token,
  });
  const requests = Array.isArray(response.requests) ? response.requests : [];
  return {
    requests: requests.map((row) => ({
      ...row,
      amountBs: Number(row?.amountBs ?? row?.amount ?? 0),
    })),
    nextCursor: response.nextCursor ?? null,
  };
}

export async function updateAdminDepositStatus(
  token: string,
  id: string,
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string,
) {
  return apiRequest(`/admin/deposits/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status, rejectionReason }),
  });
}

export async function getAdminSpecialties(token: string, includeInactive = true, search?: string): Promise<AdminSpecialty[]> {
  const query = buildQueryString({ includeInactive: includeInactive ? "true" : "false", search });
  const response = await apiRequest<AdminSpecialty[]>(`/admin/specialties${query}`, { method: "GET", token });
  return Array.isArray(response) ? response : [];
}

export async function createAdminSpecialty(token: string, payload: { name: string; description?: string }) {
  return apiRequest(`/admin/specialties`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminSpecialty(
  token: string,
  id: string,
  payload: { name?: string; description?: string; isActive?: boolean },
) {
  return apiRequest(`/admin/specialties/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deactivateAdminSpecialty(token: string, id: string) {
  return apiRequest(`/admin/specialties/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function getProfessionalSpecialtiesAdmin(token: string, userId: string) {
  const response = await apiRequest<any[]>(`/admin/specialties/professionals/${encodeURIComponent(userId)}`, {
    method: "GET",
    token,
  });
  return Array.isArray(response) ? response : [];
}

export async function assignProfessionalSpecialtiesAdmin(token: string, userId: string, specialtyIds: string[]) {
  return apiRequest(`/admin/specialties/professionals/${encodeURIComponent(userId)}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ specialtyIds }),
  });
}

export async function getPromotionalCreditGrants(
  token: string,
  limit = 100,
  recipientUserId?: string,
): Promise<PromotionalGrantRecord[]> {
  const query = buildQueryString({ limit, recipientUserId });
  const response = await apiRequest<PromotionalGrantRecord[]>(`/admin/promotional-credits/grants${query}`, {
    method: "GET",
    token,
  });
  return Array.isArray(response) ? response : [];
}

export async function grantPromotionalCredits(token: string, payload: { userId: string; amount: number; reason?: string }) {
  return apiRequest(`/admin/promotional-credits/grants`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getAdminReferrals(
  token: string,
  params?: {
    status?: "PENDING" | "QUALIFIED" | "REWARDED";
    search?: string;
    cursor?: string;
    page?: number;
    limit?: number;
  },
): Promise<AdminReferralsResponse> {
  const safePage = normalizeInteger(params?.page, DEFAULT_REFERRALS_PAGE, MIN_PAGE, MAX_PAGE);
  const safeLimit = normalizeInteger(params?.limit, DEFAULT_REFERRALS_LIMIT, MIN_LIMIT, MAX_LIMIT);
  const query = buildQueryString({
    status: params?.status,
    search: params?.search,
    cursor: params?.cursor,
    page: safePage,
    limit: safeLimit,
  });
  const response = await apiRequest<any>(`/admin/referrals${query}`, {
    method: "GET",
    token,
  });

  return {
    data: Array.isArray(response?.data) ? (response.data as AdminReferralRecord[]) : [],
    nextCursor: response?.nextCursor ?? null,
    summary: {
      total: Number(response?.summary?.total ?? 0),
      pending: Number(response?.summary?.pending ?? 0),
      qualified: Number(response?.summary?.qualified ?? 0),
      rewarded: Number(response?.summary?.rewarded ?? 0),
      totalRewardCredits: Number(response?.summary?.totalRewardCredits ?? 0),
    },
  };
}

export async function getAdminConfig(token: string): Promise<Required<AdminConfigPayload>> {
  const response = await apiRequest<any>("/admin/config", { method: "GET", token });
  const creditValueBs = Number(response?.creditValueBs ?? response?.creditToSolesRate ?? 1);

  return {
    platformFeePercent: Number(response?.platformFeePercent ?? 50),
    creditValueBs,
    creditToSolesRate: creditValueBs,
    usdExchangeRate: Number(response?.usdExchangeRate ?? 6.96),
    minAppVersion: String(response?.minAppVersion ?? "1.0"),
    referralPercentage: Number(response?.referralPercentage ?? 2.5),
    referralRewardCredits: Number(response?.referralRewardCredits ?? 10),
    referralMinDepositAmount: Number(response?.referralMinDepositAmount ?? 0),
    referralEnabled: Boolean(response?.referralEnabled ?? true),
    paymentsEnabled: Boolean(response?.paymentsEnabled ?? true),
    withdrawalsEnabled: Boolean(response?.withdrawalsEnabled ?? true),
  };
}

export async function updateAdminConfig(token: string, payload: AdminConfigPayload) {
  return apiRequest("/admin/config", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getAdminBonusTiers(token: string): Promise<BonusTier[]> {
  const response = await apiRequest<BonusTier[]>("/admin/referrals/bonus-tiers", { method: "GET", token });
  return Array.isArray(response) ? response : [];
}

export async function upsertAdminBonusTier(
  token: string,
  payload: Omit<BonusTier, "id"> & { id?: string },
): Promise<BonusTier> {
  return apiRequest<BonusTier>("/admin/referrals/bonus-tiers", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminBonusTier(token: string, id: string): Promise<void> {
  await apiRequest(`/admin/referrals/bonus-tiers/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function reverseAdminReferralReward(
  token: string,
  sourceTransactionId: string,
): Promise<{ reversed: boolean; reason?: string }> {
  return apiRequest<{ reversed: boolean; reason?: string }>(
    `/admin/referrals/reverse-reward/${encodeURIComponent(sourceTransactionId)}`,
    {
      method: "POST",
      token,
    },
  );
}

export async function getAdminPackages(token: string): Promise<AdminPackage[]> {
  const response = await apiRequest<any[]>("/packages", { method: "GET", token });
  const rows = Array.isArray(response) ? response : [];
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    credits: Number(row.credits ?? 0),
    price: Number(row.price ?? 0),
    isActive: Boolean(row.isActive ?? true),
  }));
}

export async function createAdminPackage(
  token: string,
  payload: { name: string; credits: number; price: number; isActive?: boolean },
) {
  return apiRequest("/packages/create", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminPackage(
  token: string,
  id: string,
  payload: { name?: string; credits?: number; price?: number; isActive?: boolean },
) {
  return apiRequest(`/packages/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminPackage(token: string, id: string) {
  await apiRequest(`/packages/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}
