const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());

const logRoute = require('./modules/logs/log.route');
const authRoute = require('./modules/auth/auth.route');
const studentRoute = require('./modules/student/student.route');
const attendanceRoute = require('./modules/attendance/attendance.route');
const globalErrorHandler = require('./middleware/errorHandler.middleware');
const AppError = require('./utils/AppError');
const requestContextMiddleware = require('./middleware/requestContext.middleware');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
app.use(requestContextMiddleware);

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/logs', logRoute);
app.use('/api/v1/students', studentRoute);
app.use('/api/v1/attendance', attendanceRoute);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

app.use(globalErrorHandler);

module.exports = app;
