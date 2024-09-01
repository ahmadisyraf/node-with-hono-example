import { Prisma, User } from "@prisma/client";
import prisma from "../lib/prisma";

const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

const findUser = async (
  userWhereUniqueInput: Prisma.UserWhereUniqueInput
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: userWhereUniqueInput,
  });
};

const findUsers = async (params: {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}) => {
  const { where, orderBy } = params;
  return prisma.user.findMany({
    where,
    orderBy,
  });
};

const updateUser = async (params: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}) => {
  const { where, data } = params;

  return prisma.user.update({
    where,
    data,
  });
};

const deleteUser = async (
  userWhereUniqueInput: Prisma.UserWhereUniqueInput
) => {
  return prisma.user.delete({
    where: userWhereUniqueInput,
  });
};

export { createUser, findUser, findUsers, updateUser, deleteUser };
