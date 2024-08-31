"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Schedule } from "@prisma/client";

type ScheduleDetailProps = {
  schedule: Schedule;
  onClickUpdate: () => void;
  onClickDelete: () => void;
};
export const ScheduleDetail = ({
  schedule,
  onClickUpdate,
  onClickDelete,
}: ScheduleDetailProps) => {
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
        <Button className="w-full" onClick={onClickUpdate}>
          予定を変更する
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          onClick={onClickDelete}
        >
          予定を削除する
        </Button>
      </div>
    </div>
  );
};
