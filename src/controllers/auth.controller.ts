import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as authService from "../services/auth.service";
import { userLoginRequest } from "../zod/user.zod";

const auth = new Hono();

auth.post(
  "/sign-in/email-and-password",
  zValidator("json", userLoginRequest),
  async (c) => {
    const data = c.req.valid("json");

    const token = await authService.authenticate(data);

    return c.json(token);
  }
);

export default auth;
