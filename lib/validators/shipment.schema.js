import { z } from "zod";

export const shipmentSchema = z.object({
  sender: z.object({
    contactName: z.string().min(2),

    phone: z.string().min(7),

    countryCode: z.string().length(2),
  }),

  recipient: z.object({
    contactName: z.string().min(2),

    phone: z.string().min(7),

    countryCode: z.string().length(2),
  }),

  package: z.object({
    weightKg: z.number().positive(),

    lengthCm: z.number().positive(),

    widthCm: z.number().positive(),

    heightCm: z.number().positive(),
  }),
});