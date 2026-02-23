"use client";

import { create } from "zustand";
import {
  simulateClinic,
  type SimulationResponse,
  type KasanInfo,
} from "@/lib/api";

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

  // マスターデータ（APIから取得）
  specialties: string[];
  kasans: KasanInfo[];

  setFormData: (data: Partial<FormData>) => void;
  toggleKasan: (kasanId: string) => void;
  setSpecialties: (data: string[]) => void;
  setKasans: (data: KasanInfo[]) => void;
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

  specialties: [],
  kasans: [],

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

  setSpecialties: (data) => set({ specialties: data }),
  setKasans: (data) => set({ kasans: data }),

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
      const message =
        err instanceof Error ? err.message : "シミュレーションに失敗しました";
      set({ error: message, loading: false });
      return false;
    }
  },
}));
