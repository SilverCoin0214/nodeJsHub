const connections = require("../app/database");

class UserService {
  async create(user) {
    // 解构 user
    const { name, password } = user;
    console.log(name, password);

    // 编写插入语句
    const statement = `INSERT INTO user (name, password) VALUES (?, ?);`;

    // 获得数据执行结果
    const result = await connections.execute(statement, [name, password]);

    return result;
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM user WHERE name = ?`;

    const result = await connections.execute(statement, [name]);

    return result[0];
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?`;
    const [result] = await connections.execute(statement, [avatarUrl, userId]);
    return result;
  }
}

module.exports = new UserService();
