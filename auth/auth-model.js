const db = require("../database/dbConfig");

module.exports = {
  addUser,
  getUserId,
  findBy
};

function addUser(data) {
  return db("users")
    .insert(data, "id")
    .then(ids => {
      const [id] = ids;

      return getUserId(id);
    });
}

function getUserId(id) {
  return db("users")
    .where("id", "=", id)
    .first();
}

function findBy(username) {
  return db("users")
    .where("username", "=", username)
    .first();
}
