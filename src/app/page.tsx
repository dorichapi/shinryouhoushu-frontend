"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimStore } from "@/store/useSimStore";
import { SPECIALTIES, FILING_KASANS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function InputPage() {
  const router = useRouter();
  const {
    formData,
    setFormData,
    toggleKasan,
    runSimulation,
    loading,
    error,
  } = useSimStore();

  const handleSubmit = async () => {
    if (!formData.clinicName.trim()) {
      alert("クリニック名を入力してください");
      return;
    }
    if (formData.monthlyInitialVisits === 0 && formData.monthlyRevisits === 0) {
      alert("月間初診件数または再診件数を入力してください");
      return;
    }
    const ok = await runSimulation();
    if (ok) {
      router.push("/results");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── ヒーローヘッダー ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#1B4F72] via-[#2471A3] to-[#3498DB] text-white py-12 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            🏥 診療報酬改定シミュレーター 2026
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-medium">
            2026年6月施行 診療報酬改定（本体+3.09%）の収入影響を試算 |
            診療所・中小病院向け無料ツール
          </p>
        </div>
      </motion.div>

      {/* ── フォーム ── */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Step 1: 基本情報 */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                  1
                </span>
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clinicName">クリニック名</Label>
                  <Input
                    id="clinicName"
                    placeholder="例: ○○内科クリニック"
                    value={formData.clinicName}
                    onChange={(e) =>
                      setFormData({ clinicName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>診療科</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(v) => setFormData({ specialty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staffCount">常勤換算職員数</Label>
                  <Input
                    id="staffCount"
                    type="number"
                    min={1}
                    max={100}
                    value={formData.staffCount}
                    onChange={(e) =>
                      setFormData({ staffCount: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 2: 月間患者数 */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                  2
                </span>
                月間患者数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="initial">月間初診件数</Label>
                  <Input
                    id="initial"
                    type="number"
                    min={0}
                    max={10000}
                    step={50}
                    value={formData.monthlyInitialVisits}
                    onChange={(e) =>
                      setFormData({
                        monthlyInitialVisits: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    月間の初診料算定件数
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="revisits">月間再診件数</Label>
                  <Input
                    id="revisits"
                    type="number"
                    min={0}
                    max={30000}
                    step={100}
                    value={formData.monthlyRevisits}
                    onChange={(e) =>
                      setFormData({ monthlyRevisits: Number(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    月間の再診料算定件数
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 3: 届出状況 */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                  3
                </span>
                現在の届出・算定状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Checkbox
                  id="baseup"
                  checked={formData.baseupFiled}
                  onCheckedChange={(v) =>
                    setFormData({ baseupFiled: v === true })
                  }
                />
                <Label
                  htmlFor="baseup"
                  className="text-sm font-medium cursor-pointer"
                >
                  ベースアップ評価料(I) 届出済み（6点→17点に増点）
                </Label>
              </div>

              <p className="text-sm text-muted-foreground">
                既に届出・算定している項目にチェック（未届出の加算が推奨として表示されます）
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {FILING_KASANS.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <Checkbox
                      id={k.id}
                      checked={formData.filedKasans.includes(k.id)}
                      onCheckedChange={() => toggleKasan(k.id)}
                    />
                    <Label htmlFor={k.id} className="text-sm cursor-pointer">
                      {k.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* エラー表示 + リトライ */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm space-y-3">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100 cursor-pointer"
              onClick={handleSubmit}
              disabled={loading}
            >
              再試行
            </Button>
          </div>
        )}

        {/* 実行ボタン */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Button
            size="lg"
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg cursor-pointer disabled:opacity-70"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                計算中...初回は30秒ほどかかる場合があります
              </span>
            ) : (
              "🔍 シミュレーション実行"
            )}
          </Button>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground pb-8">
          本ツールの試算結果は概算であり、実際の収入額を保証するものではありません。
        </p>
      </div>
    </div>
  );
}
