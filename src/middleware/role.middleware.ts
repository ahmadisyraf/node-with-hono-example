import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const merchantMiddleware = createMiddleware(async (c, next) => {
  const payload = c.get("payload");
  const role = payload.role;

  if (role !== "MERCHANT") {
    throw new HTTPException(401, {
      message: "Only merchant can access this endpoint",
    });
  }

  await next();
});

export const adminMiddleware = createMiddleware(async (c, next) => {
  const payload = c.get("payload");
  const role = payload.role;

  if (role !== "ADMIN") {
    throw new HTTPException(401, {
      message: "Only merchant can access this endpoint",
    });
  }

  await next();
});

export const customerMiddleware = createMiddleware(async (c, next) => {
  const payload = c.get("payload");
  const role = payload.role;

  if (role !== "CUSTOMER") {
    throw new HTTPException(401, {
      message: "Only merchant can access this endpoint",
    });
  }

  await next();
});