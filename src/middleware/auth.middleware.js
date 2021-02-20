const jwt = require("jsonwebtoken");
const { PUBLIC_KEY } = require("../app/config");

const errorTypes = require("../constants/error-types");
const UserService = require("../service/user.service");
const AuthService = require("../service/auth.service");
const md5Password = require("../utils/password-handle");

const verifyLogin = async (ctx, next) => {
  // 获取用户名和密码
  const { name, password } = ctx.request.body;

  // 验证用户名或密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  // 3. 验证用户是否存在
  const result = await UserService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  // 验证密码是否正确
  if (md5Password(String(password)) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }

  ctx.user = user;
  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log("用户验证 middleware");

  const authorization = ctx.header.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");

  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
  console.log("验证权限 middleware");

  // 1. 获得 momentId 和 userId
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "");
  const resourceId = ctx.params[resourceKey];
  const userId = ctx.user.id;

  // 2. 判断user是否拥有 moment的权限
  try {
    const permisson = await AuthService.checkResource(
      tableName,
      resourceId,
      userId
    );
    if (!permisson) throw Error();
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verifyAuth,
  verifyLogin,
  verifyPermission,
};
