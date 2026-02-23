/** 円表示（カンマ区切り） */
export function formatYen(amount: number): string {
  const prefix = amount >= 0 ? "+" : "";
  return `${prefix}${amount.toLocaleString("ja-JP")}円`;
}

/** 万円表示 */
export function formatMan(amount: number): string {
  const man = amount / 10_000;
  const prefix = man >= 0 ? "+" : "";
  return `${prefix}${man.toFixed(1)}万円`;
}
