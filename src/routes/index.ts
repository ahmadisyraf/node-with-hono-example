import { Hono } from "hono";
import auth from "../controllers/auth.controller";
import user from "../controllers/user.controller";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");

app.use(logger());

app.route("/user", user);
app.route("/auth", auth);

export default app;
