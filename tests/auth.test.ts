import { describe, test, expect, afterAll } from "@jest/globals";
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
      email: "isyraf@yahoo.com",
      password: "isyraf",
    }),
  });

  return res.json();
}

describe("Auth endpoints testing", () => {
  test("Sign up user", async () => {
    const res = await app.request("/api/auth/sign-up/email-and-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmad Isyraf",
        email: "isyraf@yahoo.com",
        password: "isyraf",
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Authenticate user", async () => {
    const res = await app.request("/api/auth/sign-in/email-and-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "isyraf@yahoo.com",
        password: "isyraf",
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Invalid user authentication", async () => {
    const res = await app.request("/api/auth/sign-in/email-and-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "isyraf@yahoo.com",
        password: "ahmad",
      }),
    });

    expect(res.status).toBe(404);
    expect(await res.text()).toBe("Invalid user");
  });

  test("Refresh new token", async () => {
    const tokens = await getTokens();

    const res = await app.request("/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });

    expect(res.status).toBe(200);
  });

  test("Delete created user", async () => {
    const tokens = await getTokens();

    const res = await app.request(`/api/user/profile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.refreshToken}`,
      },
    });

    expect(res.status).toBe(200);
  });
});
