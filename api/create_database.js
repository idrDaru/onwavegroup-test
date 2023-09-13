const DB = require("../db/conn.js");
require("dotenv").config();

async function createDatabase() {
  const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };

  const queryCreateDatabase = "CREATE DATABASE onwavegroup_test";
  await DB.db(queryCreateDatabase, db).then(() => {
    db["database"] = "onwavegroup_test";
  });

  // const queryCreateUserTable =
  //   "CREATE TABLE users (ID INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, active TINYINT DEFAULT 1, PRIMARY KEY (ID))";
  // await DB.db(queryCreateUserTable, db).then(() => {
  //   console.log("Table Created Successfully !");
  // });

  // const queryAddUser =
  //   "INSERT INTO users (email, password, type) VALUES ('idrdaru@gmail.com', 'Testpass123', '1')";
  // await DB.db(queryAddUser, db).then(() => {
  //   console.log("User Added Succesfully !");
  // });

  // const queryDropDatabase = "DROP DATABASE onwavegroup_test";
  // await DB.db(queryDropDatabase, db);
}

createDatabase();
