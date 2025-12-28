import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        error: "Password is required",
    }),
    admin: z.object({
        name: z.string({
            error: "Name is required!",
        }),
        email: z.string({
            error: "Email is required!",
        }),
        contactNumber: z.string({
            error: "Contact Number is required!",
        }),
    }),
});

const createTouristValidationSchema = z.object({
  password: z.string().min(6),
  tourist: z.object( {
    name: z.string().nonempty("Name is required"),
    email: z.string().email().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createAdmin,
  createTouristValidationSchema,
};