import prisma from "../lib/prisma";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { UserLoginRequest } from "../zod/user.zod";

export function authenticate({ email, password }: UserLoginRequest) {
  return prisma.user
    .findUnique({
      where: {
        email,
      },
    })
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new HTTPException(404, { message: "Invalid user" });
      }

      const payload = {
        sub: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expiration (5 minutes)
      };

      return sign(payload, "secret_key").then((token) => ({
        accessToken: token,
      }));
    });
}
