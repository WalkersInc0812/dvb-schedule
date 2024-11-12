import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DateFormatter } from "react-day-picker";

export const formatCaption: DateFormatter = (date) => {
  return (
    <p className="text-[18px] font-medium">
      {format(date, "yyyy年MM月", { locale: ja })}
    </p>
  );
};
