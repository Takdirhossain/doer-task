const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
  asyncLocalStorage,
  setRequestContext: (req) => {
    asyncLocalStorage.run({ method: req.method, path: req.path, ipAddress: req.ip, userAgent: req.headers['user-agent'] }, () => {});
  },
  getRequestContext: () => asyncLocalStorage.getStore() || {},
};
