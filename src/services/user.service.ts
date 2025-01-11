import prisma from "../lib/prisma";
import { UserRequest, UserUpdateRequest } from "../zod/user.zod";
import bcrypt from "bcrypt";

export function createUser({ name, email, password }: UserRequest) {
  return prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    },
  });
}

export function getUsers() {
  return prisma
    .$transaction([prisma.user.findMany(), prisma.user.count()])
    .then(([user, count]) => ({
      user,
      count,
    }));
}

export function getUser({ id }: { id: string }) {
  return prisma.user.findFirst({
    where: {
      id,
    },
  });
}

export function updateUser({
  name,
  password,
  id,
}: UserUpdateRequest & { id: string }) {
  return prisma.user.update({
    data: {
      name,
      password: password ? bcrypt.hashSync(password, 10) : undefined,
    },
    where: {
      id,
    },
  });
}

export function deleteUser({ id }: { id: string }) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}
