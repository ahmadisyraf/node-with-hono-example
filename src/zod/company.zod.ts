import { z } from "zod";

export const companyRequest = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  ssm: z.string(),
});

export const companyUpdateRequest = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  ssm: z.string().optional(),
});

export type CompanyUpdateRequest = z.infer<typeof companyUpdateRequest>;
export type CompanyRequest = z.infer<typeof companyRequest>;
