function responseHandler(status, message, data) {
  return {
    status: status || 500,
    message: message || "error",
    data: data || {},
  };
}

module.exports = {
  responseHandler,
};
