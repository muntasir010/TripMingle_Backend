import { z } from "zod";

const createTouristValidationSchema = z.object({
  password: z.string().min(6),
  tourist: z.object( {
    name: z.string().nonempty("Name is required"),
    email: z.string().email().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createTouristValidationSchema,
};