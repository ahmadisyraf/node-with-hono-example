import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify, decode } from "hono/jwt";

declare module "hono" {
  interface ContextVariableMap {
    payload: any;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  await verify(token, "secret_key").catch((error) => {
    throw new HTTPException(401, { message: "Unauthorized", cause: error });
  });

  const { payload } = decode(token);

  c.set("payload", payload);

  await next();
});