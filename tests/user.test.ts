import { describe, test, expect } from "@jest/globals";
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
      email: "isyraf@icloud.com",
      password: "isyraf",
    }),
  });

  return res.json();
}

describe("User endpoint testing", () => {
  test("Sign up user", async () => {
    const res = await app.request("/api/auth/sign-up/email-and-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmad Isyraf Bin Mohd Faishal - Adzha",
        email: "isyraf@icloud.com",
        password: "isyraf",
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Get all user", async () => {
    const tokens = await getTokens();

    const res = await app.request("/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
  });

  test("Get user", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
  });

  test("Update user", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/user/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Encik Ahmad Isyraf Bin Mohd Faishal - Adzha",
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Delete user", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/user/profile`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
  });
});
