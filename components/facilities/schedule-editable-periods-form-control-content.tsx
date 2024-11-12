import React, { useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { format, isSameMonth, isSameYear, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { ja } from "date-fns/locale";
import { formatCaption } from "../format-caption";

type Props = {
  scheduleEditablePeriods: {
    targetMonth: Date;
    fromDate: Date;
    toDate: Date;
  }[];
  onSelect: ({
    month,
    dates,
  }: {
    month: Date;
    dates: DateRange | undefined;
  }) => void;
};

const ScheduleEditablePeriodsFormControlContent = ({
  scheduleEditablePeriods,
  onSelect,
}: Props) => {
  const [month, setMonth] = React.useState(new Date());
  const [month2, setMonth2] = React.useState(new Date());
  const [period, setPeriod] = React.useState<
    | {
        targetMonth: Date;
        fromDate: Date;
        toDate: Date;
      }
    | undefined
  >();

  const handleMonthChange = React.useCallback(
    async (month: Date) => {
      const period = scheduleEditablePeriods.find((period) => {
        return (
          isSameYear(period.targetMonth, month) &&
          isSameMonth(period.targetMonth, month)
        );
      });
      setPeriod(period);
      setMonth(month);
      setMonth2(subMonths(month, 1));
    },
    [scheduleEditablePeriods]
  );

  useEffect(() => {
    handleMonthChange(month);
  }, [handleMonthChange]);

  return (
    <div className="flex flex-col gap-2">
      <Calendar
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        className="rounded-md border w-fit"
        month={month}
        onMonthChange={handleMonthChange}
        classNames={{
          caption: "flex justify-center relative items-center",
          table: "w-[252px] !mt-0",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      <Calendar
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        weekStartsOn={1}
        mode="range"
        className="rounded-md border w-fit"
        selected={{
          from: period && new Date(period.fromDate),
          to: period && new Date(period.toDate),
        }}
        month={month2}
        onMonthChange={setMonth2}
        onSelect={(dates) =>
          onSelect({
            month,
            dates,
          })
        }
      />

      <p>
        {format(month, "M")}月の編集可能期間:{" "}
        {period
          ? `${format(period.fromDate, "yyyy/MM/dd")} ~ ${format(
              period.toDate,
              "yyyy/MM/dd"
            )}`
          : "未設定"}
      </p>
    </div>
  );
};

export default ScheduleEditablePeriodsFormControlContent;
