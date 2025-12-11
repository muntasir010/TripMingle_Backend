import { z } from "zod";

export const createUserValidation = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
