const { PRIVATE_KEY, PUBLIC_KEY } = require("../app/config");
const jwt = require("jsonwebtoken");

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user;

    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
    });

    // const { name } = ctx.request.body;
    ctx.body = {
      id,
      name,
      token,
    };
  }

  async success(ctx, next) {
    ctx.body = "授权成功";
  }
}

module.exports = new AuthController();
