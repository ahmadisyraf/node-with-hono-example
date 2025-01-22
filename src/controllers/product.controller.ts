import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  productImageRequest,
  productRequest,
  updateProductRequest,
} from "../zod/product.zod";
import * as productService from "../services/product.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { merchantMiddleware } from "../middleware/role.middleware";

const product = new Hono();

product.post(
  authMiddleware,
  merchantMiddleware,
  zValidator("json", productRequest),
  async (c) => {
    const data = c.req.valid("json");
    const payload = c.get("payload");

    const product = await productService.createProduct({
      ...data,
      ...{ userId: payload.sub },
    });

    return c.json(product);
  }
);

product.get(async (c) => {
  const products = await productService.getProducts();
  return c.json(products);
});

product.get("/:id", async (c) => {
  const param = c.req.param();
  const product = await productService.getProduct({ ...param });

  return c.json(product);
});

product.patch(
  "/:id",
  authMiddleware,
  merchantMiddleware,
  zValidator("json", updateProductRequest),
  async (c) => {
    const param = c.req.param();
    const data = c.req.valid("json");

    const product = await productService.updateProduct({
      ...data,
      productId: param.id,
    });

    return c.json(product);
  }
);

product.post(
  "/upload",
  authMiddleware,
  merchantMiddleware,
  zValidator("form", productImageRequest),
  async (c) => {
    const { images } = c.req.valid("form");

    const urls = await productService.uploadImage({ images });

    return c.json(urls);
  }
);

product.delete("/:id", authMiddleware, merchantMiddleware, async (c) => {
  const param = c.req.param();

  await productService.deleteProduct({ ...param });

  return c.json("Product deleted");
});

export default product;
