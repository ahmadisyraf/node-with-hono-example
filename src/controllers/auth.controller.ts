import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import bcrypt from "bcrypt";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import * as userService from "../services/user.services";

const auth = new Hono();

auth.post(
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(2),
    })
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const user = await userService.findUser({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HTTPException(404, { message: "Invalid user" });
    }

    const payload = { ...user, exp: Math.floor(Date.now() / 1000) + 60 * 5 }; // 5 minutes
    const token = await sign(payload, "secret_key");

    return c.json({ accessToken: token });
  }
);

export default auth;
