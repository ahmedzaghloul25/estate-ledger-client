// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE_URL = 'https://estate-ledger-server.onrender.com/api/v1';

// ─── Token management ─────────────────────────────────────────────────────────

let _token: string | null = null;
export const setToken = (t: string | null): void => { _token = t; };
export const getToken = (): string | null => _token;

// ─── Unauthorized callback ────────────────────────────────────────────────────

let _onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: () => void): void => { _onUnauthorized = cb; };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  user: { name: string; email: string };
}

export interface ApiProperty {
  _id: string;
  name: string;
  address: string;
  area?: number;
  status: string;
  currentTenant?: { fullName: string; email: string };
}

export interface ApiTenant {
  _id: string;
  fullName: string;
  phone?: string;
  identificationId: string;
  currentProperty?: string;
  paymentStatus?: string;
}

export interface ApiContract {
  _id: string;
  tenantId: ApiTenant;
  propertyId: ApiProperty;
  rent: number;
  paymentInterval: string;
  startDate: string;
  endDate: string;
  status: string;
  isEarlyTerminated: boolean;
}

export interface ApiPayment {
  _id: string;
  contractId: string;
  amount: number;
  dueDate: string;
  paidDate?: string | null;
  status: string;
  isVoided?: boolean;
}

export function derivePaymentStatus(p: ApiPayment): 'paid' | 'overdue' | 'upcoming' | 'voided' {
  if (p.isVoided) return 'voided';
  if (p.paidDate) return 'paid';
  if (new Date(p.dueDate) < new Date()) return 'overdue';
  return 'upcoming';
}

export interface ApiSummary {
  ytdRevenue: number;
  collected: number;
  pending: number;
  overdue: number;
  collectedPercent: number;
}

export interface ApiMonthlyPoint {
  month: string;
  amount: number;
}

export interface ApiBreakdown {
  paid: { count: number; amount: number };
  upcoming: { count: number; amount: number };
  overdue: { count: number; amount: number };
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (res.status === 401) {
    setToken(null);
    _onUnauthorized?.();
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    throw new Error(json.message ?? json.error ?? 'Request failed');
  }
  return json.data as T;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') clean[k] = v;
  }
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function loginApi(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ─── Properties ───────────────────────────────────────────────────────────────

export function getProperties(): Promise<ApiProperty[]> {
  return apiFetch<ApiProperty[]>('/properties');
}

export function getPropertyById(id: string): Promise<ApiProperty> {
  return apiFetch<ApiProperty>(`/properties/${id}`);
}

export function createProperty(body: { name: string; address: string; area?: number }): Promise<ApiProperty> {
  return apiFetch<ApiProperty>('/properties', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function deleteProperty(id: string): Promise<void> {
  return apiFetch<void>(`/properties/${id}`, { method: 'DELETE' });
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export function getTenants(): Promise<ApiTenant[]> {
  return apiFetch<ApiTenant[]>('/tenants');
}

export function createTenant(body: {
  fullName: string;
  phone?: string;
  identificationId?: string;
}): Promise<ApiTenant> {
  return apiFetch<ApiTenant>('/tenants', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function deleteTenant(id: string): Promise<void> {
  return apiFetch<void>(`/tenants/${id}`, { method: 'DELETE' });
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export function getContracts(status?: string): Promise<ApiContract[]> {
  const qs = buildQuery({ status });
  return apiFetch<ApiContract[]>(`/contracts${qs}`);
}

export function getContractById(id: string): Promise<ApiContract> {
  return apiFetch<ApiContract>(`/contracts/${id}`);
}

export function createContract(body: {
  tenantId: string;
  propertyId: string;
  rent: number;
  paymentInterval: string;
  securityDeposit?: number;
  annualIncrease?: number;
  startDate: string;
  endDate: string;
}): Promise<ApiContract> {
  return apiFetch<ApiContract>('/contracts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function terminateContract(id: string, terminationDate?: string): Promise<void> {
  return apiFetch<void>(`/contracts/${id}/terminate`, {
    method: 'PATCH',
    body: JSON.stringify(terminationDate ? { terminationDate } : {}),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function getPayments(filters?: { contractId?: string; status?: string }): Promise<ApiPayment[]> {
  const qs = buildQuery({ contractId: filters?.contractId, status: filters?.status });
  return apiFetch<ApiPayment[]>(`/payments${qs}`);
}

export function collectPayment(id: string, paidDate?: string): Promise<ApiPayment> {
  return apiFetch<ApiPayment>(`/payments/${id}/collect`, {
    method: 'PATCH',
    body: JSON.stringify(paidDate ? { paidDate } : {}),
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function getReportSummary(year: number): Promise<ApiSummary> {
  return apiFetch<ApiSummary>(`/reports/summary?year=${year}`);
}

export function getReportMonthly(months: number): Promise<{ data: ApiMonthlyPoint[] }> {
  return apiFetch<{ data: ApiMonthlyPoint[] }>(`/reports/monthly?months=${months}`);
}

export function getReportBreakdown(): Promise<ApiBreakdown> {
  return apiFetch<ApiBreakdown>('/reports/breakdown');
}
