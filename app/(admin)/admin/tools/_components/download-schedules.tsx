"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import JSZip from "jszip";
import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import html2canvas from "html2canvas";
import { ComponentType } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ja } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { Schedule } from "@prisma/client";
import { getSchedulesByMonth } from "@/lib/schedules";
import { cn } from "@/lib/utils";
import { formatCaption } from "@/components/format-caption";

interface ComponentData<T> {
  component: ComponentType<T>;
  props: T;
  id: string | number;
}

interface CalendarComponentProps {
  schedules: Schedule[];
}
// TODO: refactor with app/(calendar)/calendar/_components/calendar-section.tsx
const CalendarComponent: React.FC<CalendarComponentProps> = ({ schedules }) => {
  return (
    <Calendar
      locale={ja}
      formatters={{ formatCaption }}
      weekStartsOn={1}
      showOutsideDays={false}
      month={schedules[0].start}
      selected={schedules.map((schedule) => schedule.start)}
      className="rounded-md border w-fit"
      classNames={{
        head_cell:
          "text-muted-foreground rounded-md w-32 font-normal text-[0.8rem]",
        cell: "h-32 w-32 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-32 w-32 p-0 font-normal aria-selected:opacity-100 text-wrap"
        ),
      }}
      components={{
        DayContent: ({ date }) => {
          const schedule = schedules.find((schedule) =>
            isSameDay(schedule.start, date)
          );
          return (
            <>
              {date.getDate()}
              <br />
              {schedule && (
                <>
                  {format(schedule.start, "HH:mm")}~
                  {format(schedule.end, "HH:mm")}
                  <br />
                  {schedule.meal ? "給食あり" : "給食なし"}
                  <br />
                  {schedule.notes}
                </>
              )}
            </>
          );
        },
      }}
    />
  );
};

type Props = {};

const DownloadSchedules = (props: Props) => {
  const [month, setMonth] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const generateAndDownloadAllAsZip = async () => {
    setIsProcessing(true);

    const schedules = await getSchedulesByMonth({
      year: month.getFullYear(),
      month: month.getMonth() + 1,
    });
    const schedulesByStudentName = schedules.reduce((acc, schedule) => {
      const studentName = schedule.student.name;
      if (!acc[studentName]) {
        acc[studentName] = [];
      }
      acc[studentName].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);
    const componentsData: ComponentData<CalendarComponentProps>[] =
      Object.entries(schedulesByStudentName).map(
        ([studentName, schedules], i) => {
          return {
            id: studentName,
            component: CalendarComponent,
            props: {
              schedules,
            },
          };
        }
      );

    const zip = new JSZip();

    for (const { component: Component, props, id } of componentsData) {
      // コンポーネントをHTML文字列にレンダリング
      const componentHtml = ReactDOMServer.renderToString(
        <Component {...props} />
      );

      // 一時的なDIV要素を作成し、そこにHTMLを設定
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = componentHtml;
      tempDiv.style.position = "absolute";
      tempDiv.style.top = "-10000px";
      document.body.appendChild(tempDiv);

      try {
        // html2canvasを使用して画像を生成
        const canvas = await html2canvas(tempDiv);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve)
        );
        if (blob) {
          zip.file(`${id}.png`, blob);
        }
      } finally {
        // 一時的なDIV要素を削除
        document.body.removeChild(tempDiv);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${month.getFullYear()}-${month.getMonth() + 1}.zip`;
    link.click();
    setIsProcessing(false);
  };

  return (
    <div>
      <Calendar
        mode="single"
        locale={ja}
        formatters={{ formatCaption }}
        month={month}
        onMonthChange={setMonth}
        classNames={{
          table: "w-[252px]",
          head_row: "hidden",
          row: "hidden",
        }}
      />
      <Button onClick={generateAndDownloadAllAsZip} disabled={isProcessing}>
        {isProcessing ? (
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
        ) : (
          <Icons.fileDown className="mr-2 w-4 h-4" />
        )}
        {month.getFullYear()}年{month.getMonth() + 1}
        月でカレンダーを一括ダウンロード
      </Button>

      {/* 表示確認用 */}
      {/* <CalendarComponent
        schedules={[
          {
            id: "adsf",
            studentId: "asdf",
            start: new Date(),
            end: new Date(),
            meal: true,
            notes: "ほげほげほげほげほげほげほげほほげほげ",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
        ]}
      /> */}
    </div>
  );
};

export default DownloadSchedules;
