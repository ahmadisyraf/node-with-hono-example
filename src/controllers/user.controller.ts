import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import * as userService from "../services/user.service";
import { userRequest, userUpdateRequest } from "../zod/user.zod";

const user = new Hono();

user.post(zValidator("json", userRequest), async (c) => {
  const { name, email, password } = c.req.valid("json");

  const user = await userService.createUser({
    name,
    email,
    password,
  });

  return c.json(user);
});

user.get(jwt({ secret: "secret_key" }), async (c) => {
  const user = await userService.getUsers();

  return c.json(user);
});

user.get("/:id", jwt({ secret: "secret_key" }), async (c) => {
  const { id } = c.req.param();
  const user = await userService.getUser({ id });

  return c.json(user);
});

user.patch(
  "/:id",
  zValidator("json", userUpdateRequest),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const { id } = c.req.param();
    const { name, password } = c.req.valid("json");

    const user = await userService.updateUser({
      name,
      password,
      id,
    });

    return c.json(user);
  }
);

user.delete("/:id", jwt({ secret: "secret_key" }), async (c) => {
  const { id } = c.req.param();

  await userService.deleteUser({ id });

  return c.json("User deleted");
});

export default user;
