import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as authService from "../services/auth.service";
import { userLoginRequest, userRequest } from "../zod/user.zod";
import { refreshTokenRequest } from "../zod/auth.zod";

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

auth.post(
  "/sign-up/email-and-password",
  zValidator("json", userRequest),
  async (c) => {
    const data = c.req.valid("json");
    const user = await authService.createUser(data);

    return c.json(user);
  }
);

auth.post(
  "/refresh-token",
  zValidator("json", refreshTokenRequest),
  async (c) => {
    const { refreshToken } = c.req.valid("json");

    const token = await authService.refreshAccessToken({
      token: refreshToken,
    });

    return c.json(token);
  }
);

export default auth;
