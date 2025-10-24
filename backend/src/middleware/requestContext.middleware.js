const { asyncLocalStorage } = require("../utils/requestContext");

module.exports = (req, res, next) => {
  asyncLocalStorage.run({ method: req.method, path: req.path, ipAddress: req.ip, userAgent: req.headers['user-agent'] }, () => {
    next();
  });
};
