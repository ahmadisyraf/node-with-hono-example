import prisma from "../lib/prisma";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcrypt";
import { sign, verify } from "hono/jwt";
import { UserLoginRequest, UserRequest } from "../zod/user.zod";
import redis from "../lib/redis";

export async function authenticate({ email, password }: UserLoginRequest) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new HTTPException(404, { message: "Invalid user" });
  }

  const accessTokenPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expiration (5 minutes)
  };

  const refreshTokenPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Refresh token expiration (7 days / 1 week)
  };

  const [accessToken, refreshToken] = await Promise.all([
    sign(accessTokenPayload, "secret_key"),
    sign(refreshTokenPayload, "secret_key"),
  ]);

  await redis.set(
    `session:${refreshToken}`,
    JSON.stringify(refreshTokenPayload),
    "EX",
    604800
  ); // 1 week

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const payload = await verify(refreshToken, "secret_key");

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new HTTPException(401, { message: "Refresh token expired" });
  }

  const cache = await redis.get(`session:${refreshToken}`);

  if (!cache) {
    throw new HTTPException(404, { message: "Session not found" });
  }

  const user = JSON.parse(cache);

  const accessTokenPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expiration (5 minutes)
  };

  const accessToken = await sign(accessTokenPayload, "secret_key");

  return {
    accessToken,
    refreshToken,
  };
}

export function createUser({ name, email, password, address }: UserRequest) {
  return prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      address: {
        create: address,
      },
    },
    include: { address: true },
  });
}
