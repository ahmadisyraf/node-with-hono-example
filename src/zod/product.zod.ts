import { z } from "zod";

export const productRequest = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
  image: z.array(z.string()),
});

export const updateProductRequest = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
});

export const productImageRequest = z.object({
  images: z.array(z.instanceof(File)),
});

export type ProductRequest = z.infer<typeof productRequest>;
export type UpdateProductRequest = z.infer<typeof updateProductRequest>;
export type ProductImageRequest = z.infer<typeof productImageRequest>;
