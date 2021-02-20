const Router = require("koa-router");

const { login, success } = require("../controller/auth.controller.js");
const { verifyAuth, verifyLogin } = require("../middleware/auth.middleware.js");

const authRouter = new Router();

authRouter.post("/login", verifyLogin, login);
authRouter.post("/test", verifyAuth, success);

module.exports = authRouter;
