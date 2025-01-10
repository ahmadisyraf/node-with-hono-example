import { z } from "zod";

export const userRequest = z.object({
  name: z.string().min(2),
  password: z.string().min(2),
  email: z.string().email(),
});

export const userResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userLoginRequest = z.object({
  email: z.string().min(2).email(),
  password: z.string().min(2),
});

export const userUpdateRequest = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(2).optional(),
});

export type UserLoginRequest = z.infer<typeof userLoginRequest>;
export type UserUpdateRequest = z.infer<typeof userUpdateRequest>;
export type UserRequest = z.infer<typeof userRequest>;
export type UserResponse = z.infer<typeof userResponse>;
