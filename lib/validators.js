import { z } from "zod";

export const shipmentSchema = z.object({
  receiverName: z.string().min(2),

  weightKg: z.number().positive(),

  length: z.number().positive(),

  width: z.number().positive(),

  height: z.number().positive(),
});