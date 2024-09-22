"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import html2canvas from "html2canvas";
import { ComponentType } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { Schedule } from "@prisma/client";
import { DateFormatter } from "react-day-picker";
import { getSchedulesByMonth } from "@/lib/schedules";

const formatCaption: DateFormatter = (date) => {
  return (
    <p className="text-[18px] font-medium">
      {format(date, "yyyy年MM月", { locale: ja })}
    </p>
  );
};

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
      month={schedules[0].start}
      modifiers={{
        present: schedules
          .filter((schedule) => schedule.attendance)
          .map((schedule) => schedule.start),
        absent: schedules
          .filter((schedule) => !schedule.attendance)
          .map((schedule) => schedule.start),
      }}
      modifiersClassNames={{
        present: "bg-green-500",
        absent: "bg-red-500",
      }}
      weekStartsOn={1}
      showOutsideDays={false}
      className="rounded-md border w-fit"
    />
  );
};

type Props = {};

const DownloadAttendances = (props: Props) => {
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
    </div>
  );
};

export default DownloadAttendances;
