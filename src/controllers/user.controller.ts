import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as userService from "../services/user.service";
import { userUpdateRequest } from "../zod/user.zod";
import { authMiddleware } from "../middleware/auth.middleware";

const user = new Hono();

user.get(authMiddleware, async (c) => {
  const user = await userService.getUsers();

  return c.json(user);
});

user.get("/profile", authMiddleware, async (c) => {
  const payload = await c.get("payload");

  const user = await userService.getUser({
    id: payload.sub,
  });

  return c.json(user);
});

user.patch(
  "/profile",
  authMiddleware,
  zValidator("json", userUpdateRequest),
  async (c) => {
    const payload = await c.get("payload");
    const data = c.req.valid("json");

    const user = await userService.updateUser({
      ...data,
      ...{ id: payload.sub },
    });

    return c.json(user);
  }
);

user.delete("/profile", authMiddleware, async (c) => {
  const payload = await c.get("payload");

  await userService.deleteUser({
    id: payload.sub,
  });

  return c.json("User deleted");
});

export default user;
