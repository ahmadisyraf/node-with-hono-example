import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { jwt } from "hono/jwt";
import * as userService from "../services/user.services";

const user = new Hono();

user.post(
  zValidator(
    "json",
    z.object({
      name: z.string().min(2),
      password: z.string().min(2),
      email: z.string().email(),
    })
  ),
  async (c) => {
    const { name, email, password } = c.req.valid("json");

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await userService.createUser({
      name,
      password: hashedPassword,
      email,
    });

    return c.json(createUser);
  }
);

user.get(jwt({ secret: "secret_key" }), async (c) => {
  const user = await userService.findUsers({});

  return c.json(user);
});

user.get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().min(2),
    })
  ),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const { id } = c.req.valid("param");

    const user = await userService.findUser({ id });

    return c.json(user);
  }
);

user.patch(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().min(2),
    })
  ),
  zValidator(
    "json",
    z.object({
      name: z.string().optional(),
      password: z.string().optional(),
    })
  ),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { name, password } = c.req.valid("json");

    const newPassword =
      !password || password === ""
        ? undefined
        : await bcrypt.hash(password, 10);

    const user = await userService.updateUser({
      where: { id },
      data: { name, password: newPassword },
    });

    return c.json(user);
  }
);

user.delete(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string().min(2),
    })
  ),
  jwt({ secret: "secret_key" }),
  async (c) => {
    const { id } = c.req.valid("param");

    await userService.deleteUser({ id });

    return c.json("User deleted");
  }
);

export default user;
