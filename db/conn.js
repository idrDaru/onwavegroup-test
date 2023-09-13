const mysql = require("mysql");

async function db(query, db) {
  const conn = mysql.createConnection(db);

  if (query) {
    return new Promise(async (resolve, reject) => {
      try {
        await openConnection(conn)
          .then(async () => {
            await executeQuery(conn, query)
              .then(async (value) => {
                await closeConnection(conn).catch((err) => {
                  console.log(err);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        resolve();
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
};
