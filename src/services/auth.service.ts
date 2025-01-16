import prisma from "../lib/prisma";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { UserLoginRequest } from "../zod/user.zod";
import redis from "../lib/redis";

export async function authenticate({ email, password }: UserLoginRequest) {
  let user;
  const cache = await redis.get(`auth:${email}`);

  if (cache) user = JSON.parse(cache);

  if (!cache) {
    user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    await redis.set(`auth:${email}`, JSON.stringify(user), "EX", 604800); // One week
  }

  if (!bcrypt.compareSync(password, user.password)) {
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
}