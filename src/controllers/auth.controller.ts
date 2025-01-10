import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as authService from "../services/auth.service";
import { userLoginRequest } from "../zod/user.zod";

const auth = new Hono();

auth.post(zValidator("json", userLoginRequest), async (c) => {
  const { email, password } = c.req.valid("json");

  const token = await authService.authenticate({
    email,
    password,
  });

  return c.json(token);
});

export default auth;
