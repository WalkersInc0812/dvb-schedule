"use client";

import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { Schedule, ScheduleEditablePeriod } from "@prisma/client";
import { cn } from "@/lib/utils";

type ScheduleDetailProps = {
  schedule: Schedule;
  editablePeriod: ScheduleEditablePeriod | undefined;
  onClickUpdate: () => void;
  onClickDelete: () => void;
};
export const ScheduleDetail = ({
  schedule,
  editablePeriod,
  onClickUpdate,
  onClickDelete,
}: ScheduleDetailProps) => {
  const editable =
    !!editablePeriod &&
    parse(editablePeriod.fromDate, "yyyy-MM-dd", new Date()) <= new Date() &&
    new Date() <= parse(editablePeriod.toDate, "yyyy-MM-dd", new Date());

  return (
    <div className="space-y-4 text-start">
      <p className="text-[20px] font-bold">
        {format(schedule.start, "PPP(E)", { locale: ja })}
      </p>

      <div className="space-y-1">
        <p>開始時間</p>
        <p>{format(schedule.start, "p", { locale: ja })}</p>
      </div>

      <div className="space-y-1">
        <p>終了時間</p>
        <p>{format(schedule.end, "p", { locale: ja })}</p>
      </div>

      <div className="space-y-1">
        <p>給食の有無</p>
        <p>{schedule.meal ? "有" : "無"}</p>
      </div>

      <div className="space-y-1">
        <p>出欠</p>
        <p>{schedule.attendance ? "◯" : "×"}</p>
      </div>

      <div className="space-y-1">
        <p>備考</p>
        <p>{schedule.notes ? schedule.notes : "-"}</p>
      </div>

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
