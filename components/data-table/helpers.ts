import { filterFns as buildInFilterFns, FilterFn } from "@tanstack/react-table";
import { isDateRange } from "react-day-picker";

/**
 * 日付範囲フィルタリング
 *
 * TODO: 未実装なもの
 * - [ ] value が string の場合の正規表現チェック
 * - [ ] value が Date の場合の処理
 */
const inDateRange: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);

  // value が string でない場合はヒットさせない
  if (typeof value !== "string") {
    return false;
  }
  const date = new Date(value);

  // 有効な日付範囲が指定されていない場合はヒットさせる
  if (!isDateRange(filterValue)) {
    return true;
  }

  // from のみ指定されている場合、from と等しい日付のみをヒットさせる
  if (filterValue.from && !filterValue.to) {
    return date.getTime() == filterValue.from.getTime();
  }

  // from と to が指定されている場合、その範囲内の日付をヒットさせる
  if (filterValue.from && filterValue.to) {
    return (
      date.getTime() >= filterValue.from.getTime() &&
      date.getTime() <= filterValue.to.getTime()
    );
  }

  // それ以外の場合はヒットさせる
  return true;
};

export const filterFns = {
  ...buildInFilterFns,
  inDateRange,
};
