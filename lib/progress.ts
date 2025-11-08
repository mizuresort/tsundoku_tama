/**
 * 進捗率を計算する
 */
export function calculateProgress(currentPage: number, totalPage: number): number {
  // NaN、undefined、null、0以下の値をチェック
  if (
    !Number.isFinite(currentPage) ||
    !Number.isFinite(totalPage) ||
    totalPage <= 0
  ) {
    return 0;
  }
  const progress = Math.round((currentPage / totalPage) * 100);
  // 進捗率が0-100の範囲内に収まるようにする
  return Math.max(0, Math.min(100, progress));
}

/**
 * ページ数を範囲内に制限する
 */
export function clampPage(page: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, page));
}

