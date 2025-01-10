import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../services/user.service";
import { userLoginRequest } from "../zod/user.zod";

const auth = new Hono();

auth.post(zValidator("json", userLoginRequest), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await getUserByEmail({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HTTPException(404, { message: "Invalid user" });
  }

  const payload = { ...user, exp: Math.floor(Date.now() / 1000) + 60 * 5 }; // 5 minutes
  const token = await sign(payload, "secret_key");

  return c.json({ accessToken: token });
});

export default auth;
