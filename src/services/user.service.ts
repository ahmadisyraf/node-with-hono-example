import { HTTPException } from "hono/http-exception";
import prisma from "../lib/prisma";
import { UserUpdateRequest } from "../zod/user.zod";
import bcrypt from "bcrypt";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUser({ id }: { id: string }) {
  return prisma.user.findFirst({
    where: { id },
    include: { address: true },
  });
}

export async function updateUser({
  name,
  password,
  id,
  address,
}: UserUpdateRequest & { id: string }) {
  return prisma.user.update({
    data: {
      name,
      password: password ? bcrypt.hashSync(password, 10) : undefined,
      address: address
        ? {
            upsert: {
              create: address,
              update: address,
            },
          }
        : undefined,
    },
    where: { id },
    include: { address: true },
  });
}

export async function deleteUser({ id }: { id: string }) {
  const user = await prisma.user.findFirst({
    where: { id },
    include: { address: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  if (user.address) {
    await prisma.address.delete({
      where: { userId: id },
    });
  }

  await prisma.user.delete({
    where: { id },
  });
}
