import { API_BASE, IS_MOCK } from "@/config";
import {
  mockPostTacto,
  mockPostParicion,
  mockGetTactos,
  mockGetParicionesEstimadas,
} from "@/lib/mocks";

export type ApiResult = { status: number; json: any };

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function postTacto(body: any): Promise<ApiResult> {
  if (IS_MOCK) {
    await delay(500);
    return mockPostTacto(body);
  }
  const res = await fetch(`${API_BASE}/tactos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export async function postParicion(body: any): Promise<ApiResult> {
  if (IS_MOCK) {
    await delay(500);
    return mockPostParicion(body);
  }
  const res = await fetch(`${API_BASE}/pariciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export async function getTactos(params: Record<string, string>): Promise<ApiResult> {
  const qs = new URLSearchParams(params);
  if (IS_MOCK) {
    await delay(400);
    return mockGetTactos(qs);
  }
  const res = await fetch(`${API_BASE}/tactos?${qs.toString()}`);
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

export async function getParicionesEstimadas(
  params: Record<string, string>,
): Promise<ApiResult> {
  const qs = new URLSearchParams(params);
  if (IS_MOCK) {
    await delay(400);
    return mockGetParicionesEstimadas(qs);
  }
  const res = await fetch(`${API_BASE}/pariciones-estimadas?${qs.toString()}`);
  return { status: res.status, json: await res.json().catch(() => ({})) };
}
