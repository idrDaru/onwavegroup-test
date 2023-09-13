const mysql = require("mysql");
require("dotenv").config();

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
                await closeConnection(conn).catch((err) => {
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

        resolve(true);
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
