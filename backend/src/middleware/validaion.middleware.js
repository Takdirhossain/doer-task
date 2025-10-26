const AppError = require('../utils/AppError');

const validateBody = (req, res, next) => {
  if (!req) return next(new AppError('Request object is missing', 500));

  const method = req.method.toLowerCase();

  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    return next(); 
  }

  if (['post', 'put', 'patch'].includes(method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Payload is required', 400));
    }
  }

  next();
};

module.exports = validateBody;
