const http = require("http");
const fs = require("fs");
const DB = require("./db/config.js");
const FilePath = require("./lib/file_path.js");
const AddUser = require("./api/add_user.js");
const querystring = require("querystring");
const formidable = require("formidable");
const path = require("path");
require("dotenv").config();

const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;

const server = http.createServer(async (req, res) => {
  await DB.db();
  const url = req.url;
  console.log("request was made: " + url);
  const filePath = FilePath.filePath(url);
  if (url.startsWith("/api")) {
    if (url.includes("add_user") && req.method.toLowerCase() === "post") {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const response = await AddUser.addUser(fields);
        res.statusCode = 301;
        res.setHeader("Location", "/");
        return res.end();
      });
    } else if (
      url.includes("add_image") &&
      req.method.toLowerCase() === "post"
    ) {
      const options = {
        keepExtensions: true,
      };
      const form = new formidable.IncomingForm(options);
      form.parse(req, (err, fields, files) => {
        files.image.forEach(async (value) => {
          const oldPath = value.filepath;
          const newPath = path.join(
            __dirname,
            "upload_images",
            value.newFilename
          );

          const rawData = fs.readFileSync(oldPath);
          fs.writeFileSync(newPath, rawData, (err) => {
            if (err) throw err;
          });

          const jsonModelPath = path.join(
            __dirname,
            "model",
            "source_images.json"
          );

          const jsonModel = fs.readFileSync(jsonModelPath);
          var obj = JSON.parse(jsonModel);
          obj.push(`/upload_images/${value.newFilename}`);
          var newData = JSON.stringify(obj);
          fs.writeFileSync(jsonModelPath, newData, (err) => {
            if (err) throw err;
          });
        });
        res.statusCode = 301;
        res.setHeader("Location", "/");
        return res.end();
      });
    } else if (url.includes("source_images") && req.method === "GET") {
      const filePath = "./model/source_images.json";
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.log("Error reading JSON file: ", err);
          return;
        }
        const jsonData = JSON.parse(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(jsonData));
        return res.end();
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  } else {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server Error");
        return;
      }

      var contentType = "text/html";
      if (filePath.endsWith(".css")) {
        contentType = "text/css";
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.write(data);
      return res.end();
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
