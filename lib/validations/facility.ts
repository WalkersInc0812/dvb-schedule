import z from "zod";

export const facilityUpdateSchema = z.object({
  name: z.string().min(1),
  scheduleEditablePeriods: z.array(
    z.object({
      targetMonth: z.date(),
      fromDate: z.date(),
      toDate: z.date(),
    })
  ),
  mealSettingActiveDates: z.array(z.date()),
});
export type FacilityUpdateSchemaType = z.infer<typeof facilityUpdateSchema>;
