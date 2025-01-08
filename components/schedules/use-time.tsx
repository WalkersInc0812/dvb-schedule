import { hourOptions, minuteOptions } from "./utils";
import { useState } from "react";

/**
 * 設計
 * - 初期値: 7:45
 * - 時の選択肢: 7~19
 * - 分の選択肢:
 *   - 時が7の場合、45~55 by 5
 *   - 時が19の場合、0~30 by 5
 * - 時が更新されたとき:
 *   - 時が7かつ、分が45より小さい場合、分を45にセットする
 *   - 時が19かつ、分が30より大きい場合、分を30にセットする
 * - 分が更新されたとき:
 *   - 時が7かつ、分が45より小さい場合、分を45にセットする
 *   - 時が19かつ、分が30より大きい場合、分を30にセットする
 */
export const useTime = (
  formGetValues: () => Date,
  formSetValue: (value: Date) => void
) => {
  const START = {
    HOUR: 7,
    MINUTE: 45,
  };
  const END = {
    HOUR: 19,
    MINUTE: 30,
  };

  const [hour, setHour] = useState(formGetValues().getHours());
  const [minute, setMinute] = useState(formGetValues().getMinutes());

  const changeHour = (value: string) => {
    const newHour = parseInt(value);
    const newMinute =
      newHour === START.HOUR && minute < START.MINUTE
        ? START.MINUTE
        : newHour === END.HOUR && minute > END.MINUTE
        ? END.MINUTE
        : minute;
    let newDate = formGetValues();
    newDate.setHours(newHour);
    newDate.setMinutes(newMinute);
    formSetValue(newDate);
    setHour(newHour);
    setMinute(newMinute);
  };

  const changeMinute = (value: string) => {
    const valueInt = parseInt(value);
    const newMinute =
      hour === START.HOUR && valueInt < START.MINUTE
        ? START.MINUTE
        : hour === END.HOUR && valueInt > END.MINUTE
        ? END.MINUTE
        : valueInt;
    let newDate = formGetValues();
    newDate.setMinutes(newMinute);
    formSetValue(newDate);
    setMinute(newMinute);
  };

  const minuteOptionClassValue = (value: string) => {
    const hour = formGetValues().getHours();
    return (hour === START.HOUR && Number(value) < START.MINUTE) ||
      (hour === END.HOUR && Number(value) > END.MINUTE)
      ? "hidden"
      : "block";
  };

  return {
    hourOptions: hourOptions.slice(START.HOUR, END.HOUR + 1),
    hour,
    changeHour,
    minuteOptions: minuteOptions,
    minute,
    changeMinute,
    minuteOptionClassValue,
  };
};
