import { refreshToken } from "@hono/oauth-providers/linkedin";
import { z } from "zod";

export const refreshTokenRequest = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequest>;
