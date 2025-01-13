import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../src/routes";

let userId: string;
let accessToken: string;

describe("Auth endpoints testing", () => {
  beforeAll(async () => {
    const res = await app.request("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ahmad Intisar Bin Mohd Faishal - Adzha",
        email: "ahmadintisar@gmail.com",
        password: "intisar",
      }),
    });

    const data = await res.json();
    userId = data.id;
  });

  test("Authenticate user", async () => {
    const res = await app.request("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "ahmadintisar@gmail.com",
        password: "intisar",
      }),
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    accessToken = data.accessToken;
  });

  test("Invalid user authentication", async () => {
    const res = await app.request("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "ahmadintisar@gmail.com",
        password: "imtiaz",
      }),
    });

    expect(await res.text()).toBe("Invalid user");
  });

  afterAll(async () => {
    await app.request(`/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });
});
