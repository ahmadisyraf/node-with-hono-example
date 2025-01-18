import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { companyRequest, companyUpdateRequest } from "../zod/company.zod";
import * as companyService from "../services/company.service";

const company = new Hono();

company.post(
  jwt({ secret: "secret_key" }),
  zValidator("json", companyRequest),
  async (c) => {
    const payload = c.get("jwtPayload");
    const data = c.req.valid("json");

    const company = await companyService.createCompany({
      ...data,
      userId: payload.sub,
    });

    return c.json(company);
  }
);

company.get(async (c) => {
  const companies = await companyService.getCompanies();

  return c.json(companies);
});

company.get("/:id", async (c) => {
  const param = c.req.param();

  const company = await companyService.getCompany({
    ...param,
  });

  return c.json(company);
});

company.patch("/:id", zValidator("json", companyUpdateRequest), async (c) => {
  const param = c.req.param();
  const data = c.req.valid("json");

  const company = await companyService.updateCompany({
    ...data,
    userId: param.id,
  });

  return c.json(company);
});

company.delete("/:id", async (c) => {
  const param = c.req.param();

  await companyService.deleteCompany({
    ...param,
  });

  return c.json("User deleted");
});

export default company;
