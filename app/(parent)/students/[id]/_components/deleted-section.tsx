import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { ScheduleWithLogsAndUser } from "@/lib/schedules";

const timeZone = "Asia/Tokyo";

type Props = {
  schedules: ScheduleWithLogsAndUser[];
};
export const DeletedSection = ({ schedules }: Props) => {
  return (
    <div className="p-[16px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[22px] font-bold">削除済の予定(5件)</h2>
      </div>

      <div className="space-y-2">
        {schedules.slice(0, 5).map((s) => (
          <Card className="p-[14px]" key={s.id}>
            <p className="text-[16px] font-medium">
              {format(toZonedTime(s.start, timeZone), "PPP(E)", {
                locale: ja,
              })}{" "}
              {format(toZonedTime(s.start, timeZone), "p", { locale: ja })}~
              {format(toZonedTime(s.end, timeZone), "p", { locale: ja })}
            </p>
            <div className="text-[14px] font-normal">
              <p>給食: {s.meal ? "有" : "無"}</p>
              <p>備考: {s.notes ? s.notes : "-"}</p>
              <div className="text-left">
                <p>履歴:</p>
                <ul>
                  {s.logs.map((log) => (
                    <li key={log.id} className="list-inside">
                      ・{format(log.timestamp, "yyyy/MM/dd HH:mm:ss")}{" "}
                      {log.user.name}さんが
                      {log.operation === "CREATE"
                        ? "作成"
                        : log.operation === "UPDATE"
                        ? "更新"
                        : log.operation === "DELETE"
                        ? "削除"
                        : ""}
                      しました
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
