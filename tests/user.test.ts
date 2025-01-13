import { describe, test, expect, beforeEach, beforeAll } from "@jest/globals";
import app from "../src/routes";

let accessToken: string;
let userId: string;

describe("User endpoint testing", () => {
  test("Create user", async () => {
    const res = await app.request("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmad Isyraf Bin Mohd Faishal",
        email: "ahmadisyraf@icloud.com",
        password: "isyraf",
      }),
    });

    const data = await res.json();
    userId = data.id;
    expect(res.status).toBe(200);
  });

  test("Authenticate created user", async () => {
    const res = await app.request("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "ahmadisyraf@icloud.com",
        password: "isyraf",
      }),
    });

    const data = await res.json();
    accessToken = data.accessToken;
    expect(res.status).toBe(200);
  });

  test("Get all user", async () => {
    const res = await app.request("/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    expect(res.status).toBe(200);
  });

  test("Get user", async () => {
    const res = await app.request(`/api/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
  });

  test("Delete user", async () => {
    const res = await app.request(`/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    expect(res.status).toBe(200);
  });
});
