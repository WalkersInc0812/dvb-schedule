import React from "react";
import { BarChartInteractive, Data } from "./_components/bar-chart-interactive";
import { getSchedulesInRecentTwoMonths } from "@/lib/schedules";
import { ChartConfig } from "@/components/ui/chart";
import { BarChartStackedLegend } from "./_components/bar-chart-stacked-legend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {};

const AdminCustomerPage = async (props: Props) => {
  const schedules = await getSchedulesInRecentTwoMonths();
  let scheduleCountByDate: {
    date: string;
    count: number;
    presentCount: number;
    absentCount: number;
  }[] = [];
  schedules.forEach((schedule) => {
    const date = schedule.start.toISOString().slice(0, 10);
    const index = scheduleCountByDate.findIndex((d) => d.date === date);
    const presentCount = schedule.attendance ? 1 : 0;
    const absentCount = schedule.attendance ? 0 : 1;
    if (index === -1) {
      scheduleCountByDate.push({ date, count: 1, presentCount, absentCount });
    } else {
      scheduleCountByDate[index].count += 1;
      scheduleCountByDate[index].presentCount += presentCount;
      scheduleCountByDate[index].absentCount += absentCount;
    }
  });

  const total = {
    count: scheduleCountByDate.reduce((acc, curr) => acc + curr.count, 0),
    presentCount: scheduleCountByDate.reduce(
      (acc, curr) => acc + curr.presentCount,
      0
    ),
    absentCount: scheduleCountByDate.reduce(
      (acc, curr) => acc + curr.absentCount,
      0
    ),
  };

  return (
    <div>
      <h1 className="text-[20px] font-bold text-[#000] bg-[#F4F4F4] border-[#E0E0E0] border-[1px] rounded-lg p-4 mb-[40px]">
        メトリクス
      </h1>

      <Tabs defaultValue="scheduleCount">
        <TabsList>
          <TabsTrigger value="scheduleCount">予定の数</TabsTrigger>
          <TabsTrigger value="attendanceCount">出欠の数</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduleCount">
          <BarChartInteractive
            title="日毎の予定の数"
            description="直近2ヶ月の予定の数を表示しています。"
            data={scheduleCountByDate}
            total={total}
            config={
              {
                count: {
                  label: "予定の数",
                  color: "hsl(var(--chart-1))",
                },
              } satisfies ChartConfig
            }
          />
        </TabsContent>
        <TabsContent value="attendanceCount">
          <BarChartStackedLegend
            title="日毎の出欠の数"
            description="直近2ヶ月の出欠の数を表示しています。"
            data={scheduleCountByDate}
            total={total}
            config={
              {
                presentCount: {
                  label: "出席の数",
                  color: "hsl(var(--chart-2))",
                },
                absentCount: {
                  label: "欠席の数",
                  color: "hsl(var(--chart-3))",
                },
              } satisfies ChartConfig
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCustomerPage;