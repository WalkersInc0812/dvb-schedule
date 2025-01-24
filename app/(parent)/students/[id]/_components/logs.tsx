import { ScheduleLogWithUser } from "@/lib/scheduleLogs";
import { format } from "date-fns";

type Props = {
  value: ScheduleLogWithUser[];
};
export const Logs = ({ value }: Props) => {
  return (
    <div className="text-left">
      <p>履歴</p>
      <ul>
        {value.map((log) => (
          <li key={log.id}>
            {format(log.timestamp, "yyyy/MM/dd HH:mm:ss")} {log.user.name}さんが
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
  );
};
