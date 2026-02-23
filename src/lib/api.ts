const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── 型定義（APIレスポンスと1:1対応） ── */

export interface BreakdownItem {
  item_name: string;
  old_points: number;
  new_points_phase1: number;
  new_points_phase2: number;
  monthly_count: number;
  annual_impact_phase1: number;
  annual_impact_phase2: number;
}

export interface RequirementStatus {
  requirement: string;
  status: boolean | null;
}

export interface RecommendationItem {
  kasan_id: string;
  name: string;
  category: string;
  points: string;
  description: string;
  requirements: RequirementStatus[];
  difficulty: string;
  estimated_impact: string;
  priority_score: number;
}

export interface ChecklistItem {
  task: string;
  deadline: string;
  priority: string;
  detail: string;
  category: string;
}

export interface SimulationResponse {
  clinic_name: string;
  specialty: string;
  phase1_annual: number;
  phase1_monthly: number;
  phase2_annual: number;
  phase2_monthly: number;
  breakdown: BreakdownItem[];
  recommendations: RecommendationItem[];
  checklist: ChecklistItem[];
}

export interface KasanInfo {
  id: string;
  name: string;
  category: string;
  points: string;
  description: string;
  difficulty: string;
  applicable_specialties: string[];
}

export interface SimulationRequest {
  clinic_name: string;
  specialty: string;
  staff_count: number;
  monthly_initial_visits: number;
  monthly_revisits: number;
  baseup_filed: boolean;
  filed_kasans: string[];
}

/* ── API呼び出し関数 ── */

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `API Error: ${res.status}`;
    try {
      const body = await res.json();
      message = body.detail || JSON.stringify(body);
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export async function getSpecialties(): Promise<string[]> {
  return fetchJson<string[]>(`${API_BASE}/api/specialties`);
}

export async function getKasans(): Promise<KasanInfo[]> {
  return fetchJson<KasanInfo[]>(`${API_BASE}/api/kasans`);
}

export async function simulateClinic(
  req: SimulationRequest,
): Promise<SimulationResponse> {
  return fetchJson<SimulationResponse>(`${API_BASE}/api/simulate/clinic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}
