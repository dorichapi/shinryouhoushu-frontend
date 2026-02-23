/* ── 診療科一覧（ハードコード） ── */

export const SPECIALTIES = [
  "内科", "小児科", "整形外科", "皮膚科", "眼科", "耳鼻咽喉科",
  "泌尿器科", "産婦人科", "精神科", "外科", "循環器内科",
  "消化器内科", "呼吸器内科", "糖尿病内科", "総合診療",
] as const;

/* ── 届出可能な加算一覧（ハードコード） ── */

export interface FilingKasan {
  id: string;
  name: string;
}

export const FILING_KASANS: FilingKasan[] = [
  { id: "jikangai_taiou", name: "時間外対応加算" },
  { id: "chiiki_houkatsu_shinryou", name: "地域包括診療加算" },
  { id: "kansen_taisaku_koujou_3", name: "感染対策向上加算3" },
  { id: "seikatsu_shuukan_byou_kanri", name: "生活習慣病管理料" },
  { id: "zaitaku_sougoui_kanri", name: "在宅総合医療管理" },
  { id: "online_shinryou", name: "オンライン診療" },
  { id: "denshi_shinryou_jouhou", name: "医療DX推進体制整備加算" },
  { id: "hp_keisai_gimu", name: "HP掲載義務対応" },
  { id: "gairai_data_teishutsu", name: "外来データ提出加算" },
];
