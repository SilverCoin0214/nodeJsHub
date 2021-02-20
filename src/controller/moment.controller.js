const fs = require("fs");

const momentService = require("../service/moment.service");
const fileService = require("../service/file.service");
const { PICTURES_PATH } = require("../constants/file-path");

class MomentController {
  async create(ctx, next) {
    // 获取相关数据(id, content)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 将数据插入到数据库中

    const result = await momentService.create(userId, content);

    ctx.body = result;
  }

  async detail(ctx, next) {
    // 获取到信息id
    const momentId = ctx.params.momentId;

    // 通过信息Id从数据库中查询数据
    const result = await momentService.getMomentById(momentId);

    ctx.body = result;
  }

  async list(ctx, next) {
    // 获取到 offset, size
    const { offset, size } = ctx.query;

    const result = await momentService.getMomentList(offset, size);

    ctx.body = result;
  }

  async update(ctx, next) {
    // 获得 momentId
    const { momentId } = ctx.params;
    // 获得带修改的信息
    const { content } = ctx.request.body;

    // 去数据库更新内容
    const result = await momentService.update(momentId, content);

    ctx.body = result;
  }

  async remove(ctx, next) {
    const { momentId } = ctx.params;

    const result = await momentService.remove(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1. 获取标签和动态id
    const { labels } = ctx;
    const { momentId } = ctx.params;

    // 2. 添加所有的标签
    for (let label of labels) {
      // 2. 1 判断标签是否已经存在
      const isExist = await momentService.hasLabel(momentId, label.id);

      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }

    ctx.body = "给动态添加标签!";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];

    if (types.some((item) => item == type)) {
      filename = `${filename}-${type}`;
    }

    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURES_PATH}/${filename}`);
  }
}

module.exports = new MomentController();
