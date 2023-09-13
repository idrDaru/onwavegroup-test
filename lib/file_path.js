const path = require("path");

function filePath(url) {
  var result = path.join(__dirname, "../public", url);
  if (url === "/") {
    result = path.join(__dirname, "../public", "main.html");
  } else if (url.includes("/upload_images")) {
    result = path.join(__dirname, "..", url);
  }

  return result;
}

module.exports = {
  filePath,
};
