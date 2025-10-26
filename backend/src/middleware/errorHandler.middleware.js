const { createLogger } = require('../modules/logManager/log.service');
const AppError = require('../utils/AppError');

const handlePrismaError = err => {
  switch (err.code) {
    case 'P2002': 
      return new AppError(`${err.meta.target[0]} already exists`, 400);
    case 'P2003': 
      return new AppError(`Related record does not exist`, 400);
    case 'P2025':
      return new AppError(`Record not found`, 404);
    default:
      return new AppError('Database error occurred', 500);
  }
};


const handleJWTError = () => new AppError('Invalid authentication token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your session has expired. Please log in again.', 401);

const handleSyntaxError = err => new AppError('Invalid JSON format in request body.', 400);
const handleTypeError = err => new AppError('Internal type error. Please contact support.', 500);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error(`${err.name}: ${err.message}\n${err.stack}`);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};

module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message, name: err.name, code: err.code };


  if (error.code && error.code.startsWith('P')) error = handlePrismaError(error);

  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) error = handleSyntaxError(error);
  if (error instanceof TypeError) error = handleTypeError(error);
  try {
    await createLogger({
      userId: req.user?.id || null,      
      userName: req.user?.username || null, 
      level: 'ERROR',
      category: 'API',
      actionType: `${req.method} ${req.originalUrl}`, 
      message: error.message,
      meta: { body: req.body }
    });
  } catch (logErr) {
    console.error('Failed to log error:', logErr);
  }

//   if (process.env.NODE_ENV == "DEVELOPEMENT") sendErrorDev(error, res);
//   else sendErrorProd(error, res);
sendErrorDev(error, res);
};
