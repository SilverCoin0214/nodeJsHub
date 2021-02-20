const connection = require("../app/database");

class AuthService {
  async checkResource(tableName, momentId, userId) {
    const statement = `SELECT * FROM ${tableName} WHERE user_id = ? AND id = ?;`;

    const [result] = await connection.execute(statement, [userId, momentId]);

    return result.length === 0 ? false : true;
  }
}

module.exports = new AuthService();
