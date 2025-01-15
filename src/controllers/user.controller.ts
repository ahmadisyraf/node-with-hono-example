import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import * as userService from "../services/user.service";
import { userRequest, userUpdateRequest } from "../zod/user.zod";

const user = new Hono();

user.post(zValidator("json", userRequest), async (c) => {
  const data = c.req.valid("json");
  const user = await userService.createUser(data);

  return c.json(user);
});

user.get(jwt({ secret: "secret_key" }), async (c) => {
  const user = await userService.getUsers();

  return c.json(user);
});

user.get("/:id", jwt({ secret: "secret_key" }), async (c) => {
  const param = c.req.param();

  const user = await userService.getUser({ ...param });

  return c.json(user);
});

user.patch(
  "/:id",
  zValidator("json", userUpdateRequest),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const param = c.req.param();
    const data = c.req.valid("json");

    const user = await userService.updateUser({ ...data, ...param });

    return c.json(user);
  }
);

user.delete("/:id", jwt({ secret: "secret_key" }), async (c) => {
  const param = c.req.param();

  await userService.deleteUser({ ...param });

  return c.json("User deleted");
});

export default user;
