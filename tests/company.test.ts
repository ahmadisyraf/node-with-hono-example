import { describe, test, expect, beforeAll } from "@jest/globals";
import app from "../src/routes";

async function getTokens(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const res = await app.request("/api/auth/sign-in/email-and-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "johndoe@example.com",
      password: "johndoe",
    }),
  });

  return res.json();
}

let companyId: string;

describe("Test company endpoint", () => {
  beforeAll(async () => {
    await app.request("/api/auth/sign-up/email-and-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmad Isyraf Bin Mohd Faishal - Adzha",
        email: "johndoe@example.com",
        password: "johndoe",
      }),
    });
  });

  test("Create company", async () => {
    const tokens = await getTokens();

    const res = await app.request("/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify({
        name: "Isyraf Tech Sdn. Bhd.",
        email: "office@isyraf.com",
        phone: "0168746367",
        ssm: "123456789",
      }),
    });

    const company = await res.json();
    companyId = company.id;

    expect(res.status).toBe(200);
  });

  test("Get created company", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/company/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(res.status).toBe(200);
  });

  test("Get all company", async () => {
    const res = await app.request("/api/company", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
  });

  test("Update created company", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/company/${companyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify({
        name: "Isyraf Technology Sdn. Bhd",
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Delete created company", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/company/${companyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    expect(res.status).toBe(200);
  });
});
