import prisma from "../lib/prisma";
import { CompanyRequest, CompanyUpdateRequest } from "../zod/company.zod";

export async function createCompany({
  email,
  name,
  phone,
  ssm,
  userId,
}: CompanyRequest & { userId: string }) {
  await prisma.user.update({
    data: {
      role: "MERCHANT",
    },
    where: { id: userId },
  });

  return prisma.company.create({
    data: {
      email,
      name,
      phone,
      ssm,
      user: {
        connect: { id: userId },
      },
    },
  });
}

export async function getCompanies() {
  return prisma.company.findMany();
}

export async function getCompany({ id }: { id: string }) {
  return prisma.company.findFirst({
    where: { id },
  });
}

export async function updateCompany({
  email,
  name,
  phone,
  ssm,
  userId,
}: CompanyUpdateRequest & { userId: string }) {
  return prisma.company.update({
    data: {
      email,
      name,
      phone,
      ssm,
    },
    where: { id: userId },
  });
}

export async function deleteCompany({ id }: { id: string }) {
  return prisma.company.delete({
    where: { id },
  });
}
