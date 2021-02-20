const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { AVATAR_PATH } = require("../constants/file-path");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1. 获取图片相关信息
    const { mimetype, filename, size } = ctx.req.file;
    const { id } = ctx.user;

    // 2. 将图像信息数据保存到数据库中
    const result = await fileService.createAvatar(filename, mimetype, size, id);

    // 3. 将图片地址保存到 user 表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id);

    ctx.body = {
      stateCode: 666,
      message: "上传头像成功!",
    };
  }

  async savePictureInfo(ctx, next) {
    // 1. 获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;

    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = "动态图上传成功!";
  }
}

module.exports = new FileController();
