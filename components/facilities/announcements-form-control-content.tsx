import React from "react";
import { Calendar } from "../ui/calendar";
import { endOfMonth, format, parse, startOfMonth } from "date-fns";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { DebouncedInput } from "../debounce-input";
import { ja } from "date-fns/locale";
import { formatCaption } from "../format-caption";

type Announcement = {
  content: string;
  displayStartMonth: Date;
  displayEndMonth: Date;
};

type Props = {
  announcements: Announcement[];
  onChange: (announcements: Announcement[]) => void;
};

export const AnnouncementsFormControlContent = ({
  announcements,
  onChange,
}: Props) => {
  const [month, setMonth] = React.useState(new Date());

  return (
    <div className="flex flex-col gap-2">
      <Calendar
        locale={ja}
        formatters={{ formatCaption: formatCaption }}
        month={month}
        onMonthChange={setMonth}
        className="rounded-md border w-fit"
        classNames={{
          caption: "flex justify-center relative items-center",
          table: "w-[252px] !mt-0",
          head_row: "hidden",
          row: "hidden",
        }}
      />

      <div className="space-y-1">
        {announcements.map((announcement, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2",
              !(
                announcement.displayStartMonth <= month &&
                month <= announcement.displayEndMonth
              ) && "hidden"
            )}
          >
            <div className="flex items-center gap-1">
              <Select
                value={format(announcement.displayStartMonth, "yyyy-MM")}
                onValueChange={(value) => {
                  const newAnnouncements = [...announcements];
                  newAnnouncements[i].displayStartMonth = parse(
                    value,
                    "yyyy-MM",
                    new Date()
                  );
                  onChange(newAnnouncements);
                }}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder={"開始月を選択してください"} />
                </SelectTrigger>
                <SelectContent>
                  {/* 3年前から3年後までの年月の選択肢 */}
                  {Array.from({ length: 7 }).map((_, yearI) => {
                    return Array.from({ length: 12 }).map((_, monthI) => {
                      const month = new Date(
                        new Date().getFullYear() + yearI - 3,
                        monthI
                      );
                      return (
                        <SelectItem
                          key={yearI * 12 + monthI}
                          value={format(month, "yyyy-MM")}
                        >
                          {format(month, "yyyy年M月")}
                        </SelectItem>
                      );
                    });
                  })}
                </SelectContent>
              </Select>
              <span>~</span>
              <Select
                value={format(announcement.displayEndMonth, "yyyy-MM")}
                onValueChange={(value) => {
                  const newAnnouncements = [...announcements];
                  newAnnouncements[i].displayEndMonth = parse(
                    value,
                    "yyyy-MM",
                    new Date()
                  );
                  onChange(newAnnouncements);
                }}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder={"終了月を選択してください"} />
                </SelectTrigger>
                <SelectContent>
                  {/* 3年前から3年後までの年月の選択肢 */}
                  {Array.from({ length: 7 }).map((_, yearI) => {
                    return Array.from({ length: 12 }).map((_, monthI) => {
                      const month = new Date(
                        new Date().getFullYear() + yearI - 3,
                        monthI
                      );
                      return (
                        <SelectItem
                          key={yearI * 12 + monthI}
                          value={format(month, "yyyy-MM")}
                        >
                          {format(month, "yyyy年M月")}
                        </SelectItem>
                      );
                    });
                  })}
                </SelectContent>
              </Select>
            </div>

            <DebouncedInput
              value={announcement.content}
              onChange={(value) => {
                if (typeof value !== "string") {
                  throw new Error("value must be string");
                }
                const newAnnouncements = [...announcements];
                newAnnouncements[i].content = value;
                onChange(newAnnouncements);
              }}
              className="h-8"
            />
          </div>
        ))}
      </div>

      <Button
        size={"sm"}
        variant={"outline"}
        className="w-fit"
        type="button"
        onClick={() =>
          onChange([
            ...announcements,
            {
              content: "",
              displayStartMonth: startOfMonth(month),
              displayEndMonth: endOfMonth(month),
            },
          ])
        }
      >
        <Icons.circlePlus className="h-4 w-4 mr-2" />
        お知らせを追加する
      </Button>
    </div>
  );
};
