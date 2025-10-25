const apiResponse = require("../../utils/apiResponse");
const { registerSchema, loginSchema } = require("./auth.validation");
const authService = require("./auth.service");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.register = catchAsync(async (req, res, next) => {
      const { error } = registerSchema.validate(req.body);
     if (error) return next(new AppError(error.details[0].message, 400));
      const user = await authService.registerUser(req.body);
      res.json(apiResponse(true, 'User registered successfully', user));
    
  });

  exports.login = catchAsync(async (req, res, next) => {
      const { error, value } = loginSchema.validate(req.body);
      if (error) return next(new AppError(error.details[0].message, 400));
      const user = await authService.loginUser(value);
      res.json(apiResponse(true, 'User logged in successfully', user)); 
   
  });

  exports.logout = catchAsync(async (req, res) => {
    let userId = req.user.id;      
      const user = await authService.logoutUser(userId);
      res.json(apiResponse(true, 'User logged out successfully', user));
  });

