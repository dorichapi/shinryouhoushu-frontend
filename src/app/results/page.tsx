"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSimStore } from "@/store/useSimStore";
import { formatYen, formatMan } from "@/lib/format";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "至急対応",
  high: "優先度：高",
  medium: "優先度：中",
  low: "優先度：低",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  low: "低（すぐ対応可）",
  medium: "中（準備が必要）",
  high: "高（体制整備が必要）",
};

export default function ResultsPage() {
  const router = useRouter();
  const result = useSimStore((s) => s.result);

  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  if (!result) return null;

  const phaseDiff = result.phase2_annual - result.phase1_annual;

  // Chart data
  const chartData = result.breakdown.map((item) => ({
    name:
      item.item_name.length > 12
        ? item.item_name.slice(0, 12) + "…"
        : item.item_name,
    fullName: item.item_name,
    "Phase1（2026/6〜）": item.annual_impact_phase1 / 10_000,
    "Phase2（2027/6〜）": item.annual_impact_phase2 / 10_000,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── ナビバー ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-sm font-medium cursor-pointer"
          >
            ← 条件を変更する
          </Button>
          <h2 className="text-base md:text-lg font-bold text-slate-800 hidden sm:block">
            {result.clinic_name} — シミュレーション結果
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {result.specialty}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* ── KPIカード3枚 ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#1E8449] to-[#27AE60] shadow-lg">
              <p className="text-sm font-semibold text-white/80 mb-1">
                Phase1（2026年6月〜）
              </p>
              <p className="text-3xl font-extrabold font-[var(--font-dm-sans)]">
                {formatMan(result.phase1_annual)}
                <span className="text-base font-medium text-white/70 ml-1">
                  /年
                </span>
              </p>
              <p className="text-sm text-white/75 mt-1">
                月間 {formatMan(result.phase1_monthly)}
              </p>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] shadow-lg">
              <p className="text-sm font-semibold text-white/80 mb-1">
                Phase2（2027年6月〜）
              </p>
              <p className="text-3xl font-extrabold font-[var(--font-dm-sans)]">
                {formatMan(result.phase2_annual)}
                <span className="text-base font-medium text-white/70 ml-1">
                  /年
                </span>
              </p>
              <p className="text-sm text-white/75 mt-1">
                Phase1比 {formatMan(phaseDiff)} 増
              </p>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#D35400] to-[#E67E22] shadow-lg">
              <p className="text-sm font-semibold text-white/80 mb-1">
                新規届出の候補
              </p>
              <p className="text-3xl font-extrabold font-[var(--font-dm-sans)]">
                {result.recommendations.length}件
              </p>
              <p className="text-sm text-white/75 mt-1">
                今すぐ届出可能な加算
              </p>
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground">
          ※
          Phase1で物価対応料が新設（初診2点・再診2点）、Phase2（翌年度）で倍額（初診4点・再診4点）に引き上げ。
        </p>

        {/* ── 2カラム: グラフ（左）+ 推奨加算（右） ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左: グラフ */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">
                  📊 加算項目別 年間影響額
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${v}万`}
                      fontSize={12}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      fontSize={12}
                      tick={{ fill: "#475569" }}
                    />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(1)}万円`}
                      labelFormatter={(_, payload) => {
                        if (payload?.[0]?.payload?.fullName) {
                          return payload[0].payload.fullName;
                        }
                        return "";
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="Phase1（2026/6〜）"
                      fill="#26a69a"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="Phase2（2027/6〜）"
                      fill="#42a5f5"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右: 推奨加算 */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-2 space-y-3"
          >
            <h3 className="text-base font-bold text-slate-800">
              🎯 今すぐ届出可能な加算
            </h3>
            {result.recommendations.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  ✅ 主要な加算はすべて届出済みです。
                </CardContent>
              </Card>
            ) : (
              result.recommendations.map((rec) => {
                const total = rec.requirements.length;
                const fulfilled = rec.requirements.filter(
                  (r) => r.status === true,
                ).length;
                const checkable = rec.requirements.filter(
                  (r) => r.status !== null,
                ).length;
                const pct =
                  checkable > 0
                    ? Math.round((fulfilled / checkable) * 100)
                    : 0;

                const borderColor =
                  pct >= 80
                    ? "border-l-green-500"
                    : pct >= 50
                      ? "border-l-yellow-500"
                      : "border-l-red-500";

                return (
                  <Card
                    key={rec.kasan_id}
                    className={`border-0 border-l-4 ${borderColor} shadow-md`}
                  >
                    <CardContent className="py-4 px-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-slate-800">
                          {rec.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          {DIFFICULTY_LABELS[rec.difficulty] || rec.difficulty}
                        </Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        要件充足率 {pct}%（{fulfilled}/{total}）
                      </p>

                      {/* Requirements */}
                      <div className="space-y-1 pt-1">
                        {rec.requirements.map((r, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs"
                          >
                            <span className="shrink-0 mt-0.5">
                              {r.status === true
                                ? "✅"
                                : r.status === false
                                  ? "⬜"
                                  : "➖"}
                            </span>
                            <span
                              className={
                                r.status === false
                                  ? "font-semibold text-slate-700"
                                  : "text-slate-500"
                              }
                            >
                              {r.requirement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </motion.div>
        </div>

        <Separator />

        {/* ── 下部タブ: 内訳テーブル + チェックリスト ── */}
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="breakdown" className="cursor-pointer">
              📋 項目別内訳
            </TabsTrigger>
            <TabsTrigger value="checklist" className="cursor-pointer">
              ✅ チェックリスト
            </TabsTrigger>
          </TabsList>

          {/* 内訳テーブル */}
          <TabsContent value="breakdown">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-semibold">項目</th>
                      <th className="pb-3 pr-4 font-semibold text-right">
                        変動点数
                      </th>
                      <th className="pb-3 pr-4 font-semibold text-right">
                        月間件数
                      </th>
                      <th className="pb-3 pr-4 font-semibold text-right">
                        月間影響額
                      </th>
                      <th className="pb-3 pr-4 font-semibold text-right">
                        年間(Phase1)
                      </th>
                      <th className="pb-3 font-semibold text-right">
                        年間(Phase2)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((item, idx) => {
                      const monthly = Math.floor(
                        item.annual_impact_phase1 / 12,
                      );
                      return (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 pr-4 font-medium">
                            {item.item_name}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {item.new_points_phase1 - item.old_points}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {item.monthly_count.toLocaleString()}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            {formatYen(monthly)}
                          </td>
                          <td className="py-3 pr-4 text-right font-medium text-green-700">
                            {formatYen(item.annual_impact_phase1)}
                          </td>
                          <td className="py-3 text-right font-medium text-blue-700">
                            {formatYen(item.annual_impact_phase2)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* 合計行 */}
                    <tr className="font-bold bg-slate-50">
                      <td className="py-3 pr-4">合計</td>
                      <td className="py-3 pr-4" />
                      <td className="py-3 pr-4" />
                      <td className="py-3 pr-4 text-right">
                        {formatYen(Math.floor(result.phase1_annual / 12))}
                      </td>
                      <td className="py-3 pr-4 text-right text-green-700">
                        {formatYen(result.phase1_annual)}
                      </td>
                      <td className="py-3 text-right text-blue-700">
                        {formatYen(result.phase2_annual)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* チェックリスト */}
          <TabsContent value="checklist">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 space-y-3">
                {result.checklist.map((item, idx) => {
                  const color =
                    PRIORITY_COLORS[item.priority] || "bg-gray-400";
                  const label =
                    PRIORITY_LABELS[item.priority] || item.priority;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div
                        className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-slate-800">
                            {item.task}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] shrink-0"
                          >
                            {label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          期限: {item.deadline}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 免責事項 */}
        <p className="text-xs text-center text-muted-foreground pb-8">
          本ツールの試算結果は概算であり、実際の収入額を保証するものではありません。
          正確な影響額の算出には、個別の診療実績データに基づく詳細分析が必要です。
        </p>
      </div>
    </div>
  );
}
