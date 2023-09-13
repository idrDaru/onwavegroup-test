const DB = require("../db/config.js");
const ResponseHandler = require("../lib/response_handler.js");

async function addUser(data) {
  try {
    const queryAddUser = `INSERT INTO users (email, password, type, active) VALUES ('${data.email.toString()}', '${data.password.toString()}', '${data.type.toString()}', '${
      data.active
    }')`;
    const response = await DB.dbRunQuery(queryAddUser);
    return ResponseHandler.responseHandler(201, "success");
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  addUser,
};
