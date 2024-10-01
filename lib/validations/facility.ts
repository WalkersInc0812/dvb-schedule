import z from "zod";

export const facilityUpdateSchema = z.object({
  name: z.string().min(1),
  activeDates: z.array(z.date()),
});
export type FacilityUpdateSchemaType = z.infer<typeof facilityUpdateSchema>;
