import { Card } from "@/components/ui/card";
import { Schedule } from "@prisma/client";
import { format, isAfter, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  schedules: Schedule[];
};
export const UpcomingSection = ({ schedules }: Props) => {
  return (
    <div className="p-[16px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[22px] font-bold">直近の予定5件</h2>
      </div>

      <div className="space-y-2">
        {schedules
          .filter((s) => isAfter(s.start, startOfDay(new Date()))) // TODO: check timezone
          .toSorted((a, b) => {
            return a.start.getTime() - b.start.getTime();
          })
          .slice(0, 5)
          .map((s) => (
            <Card className="p-[14px]" key={s.id}>
              <p className="text-[16px] font-medium">
                {s.start.toString()}
                {format(s.start, "PPP(E)", { locale: ja })}{" "}
                {format(s.start, "p", { locale: ja })}~
                {format(s.end, "p", { locale: ja })}
              </p>
              <div className="text-[14px] font-normal">
                <p>給食: {s.meal ? "有" : "無"}</p>
                <p>備考: {s.notes ? s.notes : "-"}</p>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};
