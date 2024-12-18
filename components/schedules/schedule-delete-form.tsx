"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Schedule } from "@prisma/client";

type ScheduleDeleteFormProps = {
  schedule: Schedule;
  logs: JSX.Element;
  onSuccess?: () => void;
  onError?: () => void;
};
export const ScheduleDeleteForm = ({
  schedule,
  logs,
  onSuccess,
  onError,
}: ScheduleDeleteFormProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/schedules/${schedule.id}`, {
        method: "DELETE",
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }

      toast({
        title: "予定を削除しました",
        description: "カレンダーから削除されます。",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "予定の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

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

      <p className="text-[20px] font-bold text-center">
        本当に予定を削除しますか？
      </p>

      <div className="flex gap-4">
        <Button className="w-full" variant="destructive" onClick={handleDelete}>
          予定を削除する
        </Button>
      </div>
    </div>
  );
};
