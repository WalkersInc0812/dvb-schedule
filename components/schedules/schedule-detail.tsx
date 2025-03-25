"use client";

import { Button } from "@/components/ui/button";
import { endOfDay, format, parse, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Schedule, ScheduleEditablePeriod } from "@prisma/client";
import { cn } from "@/lib/utils";

type ScheduleDetailProps = {
  schedule: Schedule;
  editablePeriod: ScheduleEditablePeriod | undefined;
  logs: JSX.Element;
  onClickUpdate: () => void;
  onClickDelete: () => void;
  isStaff: boolean;
};
export const ScheduleDetail = ({
  schedule,
  editablePeriod,
  logs,
  onClickUpdate,
  onClickDelete,
  isStaff,
}: ScheduleDetailProps) => {
  const editable =
    isStaff ||
    (!!editablePeriod &&
      startOfDay(parse(editablePeriod.fromDate, "yyyy-MM-dd", new Date())) <=
        new Date() &&
      new Date() <=
        endOfDay(parse(editablePeriod.toDate, "yyyy-MM-dd", new Date())));

  return (
    <div className="space-y-4 text-start">
      <p className="text-[20px] font-bold">
        {format(schedule.start, "PPP(E)", { locale: ja })}
      </p>

      <div className="space-y-1">
        <p>登園時間</p>
        <p>{format(schedule.start, "p", { locale: ja })}</p>
      </div>

      <div className="space-y-1">
        <p>お迎え時間</p>
        <p>{format(schedule.end, "p", { locale: ja })}</p>
      </div>

      <div className="space-y-1">
        <p>給食の有無</p>
        <p>{schedule.meal ? "有" : "無"}</p>
      </div>

      <div className="space-y-1">
        <p>備考</p>
        <p>{schedule.notes ? schedule.notes : "-"}</p>
      </div>

      {logs}

      <div className="flex gap-4">
        <Button
          className={cn("w-full", !editable && "bg-slate-400")}
          onClick={onClickUpdate}
          disabled={!editable}
        >
          予定を変更する
        </Button>
        <Button
          className={cn("w-full", !editable && "bg-slate-400")}
          variant="destructive"
          onClick={onClickDelete}
          disabled={!editable}
        >
          予定を削除する
        </Button>
      </div>

      {!editable && (
        <div>
          <p>
            この予定は編集可能期間を過ぎています。
            <br />
            もし編集したい場合は〇〇で先生にメッセージをお願いします。
          </p>
          {editablePeriod && (
            <p>
              編集可能期間: {editablePeriod.fromDate}~{editablePeriod.toDate}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
