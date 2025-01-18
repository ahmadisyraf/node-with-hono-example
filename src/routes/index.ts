import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "../controllers/auth.controller";
import user from "../controllers/user.controller";
import company from "../controllers/company.controller";

const app = new Hono().basePath("/api");

app.use(logger());

app.route("/user", user);
app.route("/auth", auth);
app.route("/company", company);

export default app;
