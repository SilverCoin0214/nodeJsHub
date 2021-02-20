const CommentService = require("../service/comment.service");

class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const userId = ctx.user.id;

    // 插入到数据库中
    const result = await CommentService.create(momentId, content, userId);

    ctx.body = result;
  }

  async reply(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const userId = ctx.user.id;

    // 插入到数据库中
    const result = await CommentService.reply(
      momentId,
      content,
      userId,
      commentId
    );

    ctx.body = result;
  }

  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;

    const result = await CommentService.update(commentId, content);

    ctx.body = result;
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await CommentService.remove(commentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    const { momentId } = ctx.query;
    const result = await CommentService.getCommentsByMomentId(momentId);
    ctx.body = result;
  }
}

module.exports = new CommentController();
