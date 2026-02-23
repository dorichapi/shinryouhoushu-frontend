"use client";

import { create } from "zustand";
import { simulateClinic, type SimulationResponse } from "@/lib/api";

/* ── フォームデータ型 ── */

export interface FormData {
  clinicName: string;
  specialty: string;
  staffCount: number;
  monthlyInitialVisits: number;
  monthlyRevisits: number;
  baseupFiled: boolean;
  filedKasans: string[];
}

/* ── Store ── */

interface SimStore {
  formData: FormData;
  result: SimulationResponse | null;
  loading: boolean;
  error: string | null;

  setFormData: (data: Partial<FormData>) => void;
  toggleKasan: (kasanId: string) => void;
  runSimulation: () => Promise<boolean>;
}

export const useSimStore = create<SimStore>((set, get) => ({
  formData: {
    clinicName: "",
    specialty: "内科",
    staffCount: 10,
    monthlyInitialVisits: 300,
    monthlyRevisits: 2000,
    baseupFiled: true,
    filedKasans: [],
  },
  result: null,
  loading: false,
  error: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  toggleKasan: (kasanId) =>
    set((state) => {
      const current = state.formData.filedKasans;
      const next = current.includes(kasanId)
        ? current.filter((id) => id !== kasanId)
        : [...current, kasanId];
      return { formData: { ...state.formData, filedKasans: next } };
    }),

  runSimulation: async () => {
    const { formData } = get();
    set({ loading: true, error: null });
    try {
      const result = await simulateClinic({
        clinic_name: formData.clinicName,
        specialty: formData.specialty,
        staff_count: formData.staffCount,
        monthly_initial_visits: formData.monthlyInitialVisits,
        monthly_revisits: formData.monthlyRevisits,
        baseup_filed: formData.baseupFiled,
        filed_kasans: formData.filedKasans,
      });
      set({ result, loading: false });
      return true;
    } catch (err) {
      let message = "シミュレーションに失敗しました";
      if (err instanceof DOMException && err.name === "TimeoutError") {
        message = "サーバーの応答がタイムアウトしました。再度お試しください。";
      } else if (err instanceof TypeError && err.message === "Failed to fetch") {
        message = "サーバーに接続できません。しばらくしてから再度お試しください。";
      } else if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      return false;
    }
  },
}));
