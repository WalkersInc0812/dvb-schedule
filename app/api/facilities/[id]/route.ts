import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { facilityUpdateSchema } from "@/lib/validations/facility";
import { Prisma } from "@prisma/client";
import { addDays, format, isSameDay, parse, subDays } from "date-fns";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    const body = await req.json();
    console.log("in PATCH");
    console.log(body.name);
    console.log(body.announcements);
    console.log(
      body.scheduleEditablePeriods.filter(
        (period: any) =>
          period.targetMonth.includes("2024-12") ||
          period.targetMonth.includes("2025-01") ||
          period.targetMonth.includes("2025-02") ||
          period.targetMonth.includes("2025-03")
      )
    );
    console.log(body.mealSettingActiveDates);
    return new Response(null, { status: 200 });

    const payload = facilityUpdateSchema.parse({
      ...body,
      announcements: body.announcements.map(
        (announcement: {
          content: string;
          displayStartMonth: string;
          displayEndMonth: string;
        }) => ({
          content: announcement.content,
          displayStartMonth: new Date(announcement.displayStartMonth),
          displayEndMonth: new Date(announcement.displayEndMonth),
        })
      ),
      scheduleEditablePeriods: body.scheduleEditablePeriods.map(
        (period: {
          targetMonth: string;
          fromDate: string;
          toDate: string;
        }) => ({
          targetMonth: new Date(period.targetMonth),
          fromDate: new Date(period.fromDate),
          toDate: new Date(period.toDate),
        })
      ),
      mealSettingActiveDates: body.mealSettingActiveDates.map(
        (d: string) => new Date(d)
      ),
    });

    // payload.activeDates を mealSettings に変換する
    let mealSettings: Prisma.MealSettingCreateManyFacilityInput[] = [];
    payload.mealSettingActiveDates.forEach((activeDate) => {
      // activeDateの前日が期間に含まれるsettingのindexを取得
      const prevDaySettingIndex = mealSettings.findIndex((mealSetting) =>
        isSameDay(
          subDays(activeDate, 1),
          parse(mealSetting.activeToDate, "yyyy-MM-dd", new Date())
        )
      );

      // activeDateの翌日が期間に含まれるsettingのindexを取得
      const nextDaySettingIndex = mealSettings.findIndex((mealSetting) =>
        isSameDay(
          addDays(activeDate, 1),
          parse(mealSetting.activeFromDate, "yyyy-MM-dd", new Date())
        )
      );

      if (prevDaySettingIndex !== -1 && nextDaySettingIndex !== -1) {
        // 前日にも翌日にもsettingがある場合、それら2つの期間を繋げる
        const prevDaySetting = mealSettings[prevDaySettingIndex];
        const nextDaySetting = mealSettings[nextDaySettingIndex];
        mealSettings = [
          ...mealSettings.filter(
            (_value, index) =>
              index !== prevDaySettingIndex && index !== nextDaySettingIndex
          ),
          {
            activeFromDate: prevDaySetting.activeFromDate,
            activeToDate: nextDaySetting.activeToDate,
          },
        ];
      } else if (prevDaySettingIndex !== -1 && nextDaySettingIndex === -1) {
        // 前日のみにsettingがある場合、その期間の終了日を1日伸ばす
        const prevDaySetting = mealSettings[prevDaySettingIndex];
        mealSettings = [
          ...mealSettings.filter(
            (_value, index) => index !== prevDaySettingIndex
          ),
          {
            activeFromDate: prevDaySetting.activeFromDate,
            activeToDate: format(
              addDays(
                parse(prevDaySetting.activeToDate, "yyyy-MM-dd", new Date()),
                1
              ),
              "yyyy-MM-dd"
            ),
          },
        ];
      } else if (prevDaySettingIndex === -1 && nextDaySettingIndex !== -1) {
        // 翌日のみにsettingがある場合、その期間の開始日を1日延ばす
        const nextDaySetting = mealSettings[nextDaySettingIndex];
        mealSettings = [
          ...mealSettings.filter(
            (_value, index) => index !== nextDaySettingIndex
          ),
          {
            activeFromDate: format(
              subDays(
                parse(nextDaySetting.activeFromDate, "yyyy-MM-dd", new Date()),
                1
              ),
              "yyyy-MM-dd"
            ),
            activeToDate: nextDaySetting.activeToDate,
          },
        ];
      } else {
        // それ以外の場合、新しくmealSettingを追加する
        mealSettings.push({
          activeFromDate: format(activeDate, "yyyy-MM-dd"),
          activeToDate: format(activeDate, "yyyy-MM-dd"),
        });
      }
    });

    await db.facility.update({
      where: {
        id: context.params.id,
      },
      data: {
        name: payload.name,
        announcements: {
          deleteMany: {
            facilityId: context.params.id,
          },
          createMany: {
            data: payload.announcements.map((announcement) => ({
              content: announcement.content,
              displayStartMonth: format(
                announcement.displayStartMonth,
                "yyyy-MM"
              ),
              displayEndMonth: format(announcement.displayEndMonth, "yyyy-MM"),
            })),
          },
        },
        scheduleEditablePeriods: {
          deleteMany: {
            facilityId: context.params.id,
          },
          createMany: {
            data: payload.scheduleEditablePeriods.map((period) => ({
              targetMonth: format(period.targetMonth, "yyyy-MM"),
              fromDate: format(period.fromDate, "yyyy-MM-dd"),
              toDate: format(period.toDate, "yyyy-MM-dd"),
            })),
          },
        },
        mealSettings: {
          deleteMany: {
            facilityId: context.params.id,
          },
          createMany: {
            data: mealSettings,
          },
        },
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

// 論理削除
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    await db.facility.update({
      where: {
        id: context.params.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
