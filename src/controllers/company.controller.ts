import { Hono } from "hono";

const company = new Hono();

company.get(async (c) => {
  return c.json("Hello from company");
});

export default company;
