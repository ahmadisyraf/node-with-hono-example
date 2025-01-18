import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import * as userService from "../services/user.service";
import { userRequest, userUpdateRequest } from "../zod/user.zod";

const user = new Hono();

user.get(jwt({ secret: "secret_key" }), async (c) => {
  const user = await userService.getUsers();

  return c.json(user);
});

user.get("/profile", jwt({ secret: "secret_key" }), async (c) => {
  const payload = await c.get("jwtPayload");

  const user = await userService.getUser({
    id: payload.sub,
  });

  return c.json(user);
});

user.patch(
  "/profile",
  zValidator("json", userUpdateRequest),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const payload = await c.get("jwtPayload");
    const data = c.req.valid("json");

    const user = await userService.updateUser({
      ...data,
      ...{ id: payload.sub },
    });

    return c.json(user);
  }
);

user.delete("/profile", jwt({ secret: "secret_key" }), async (c) => {
  const payload = await c.get("jwtPayload");

  await userService.deleteUser({
    id: payload.sub,
  });

  return c.json("User deleted");
});

export default user;
