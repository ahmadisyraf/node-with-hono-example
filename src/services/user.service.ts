import prisma from "../lib/prisma";
import { UserRequest, UserUpdateRequest } from "../zod/user.zod";

export function createUser({ name, email, password }: UserRequest) {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
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
      password,
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

export function getUserByEmail({ email }: { email: string }) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}
