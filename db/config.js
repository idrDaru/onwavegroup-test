const mysql = require("mysql2");

async function db() {
  const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  };
  const conn = mysql.createConnection(db);

  return new Promise(async (resolve, reject) => {
    try {
      await openConnection(conn)
        .then(async () => {
          const queryCheckTable = `SELECT * FROM information_schema.tables WHERE table_schema='${process.env.DB_DATABASE}' AND table_name='users' LIMIT 1`;
          const response = await dbRunQuery(queryCheckTable);
          if (response.length == 0) {
            const queryCreateUserTable =
              "CREATE TABLE users (ID INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL, active TINYINT DEFAULT 1, PRIMARY KEY (ID))";
            console.log("Migrating Database...");
            await dbRunQuery(queryCreateUserTable);
          }
          await closeConnection(conn)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

async function dbRunQuery(query) {
  const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  };
  const conn = mysql.createConnection(db);

  if (query) {
    return new Promise(async (resolve, reject) => {
      try {
        await openConnection(conn)
          .then(async () => {
            await executeQuery(conn, query)
              .then(async (value) => {
                await closeConnection(conn)
                  .then((v) => {
                    resolve(value);
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });

        // resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

async function openConnection(conn) {
  return new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function closeConnection(conn) {
  return new Promise((resolve, reject) => {
    conn.end((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function executeQuery(conn, query) {
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  db,
  dbRunQuery,
};
