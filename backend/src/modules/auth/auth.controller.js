const apiResponse = require("../../utils/apiResponse");
const { registerSchema, loginSchema } = require("./auth.validation");
const authService = require("./auth.service");

exports.register = async (req, res) => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) return res.status(400).json(apiResponse(false, error.message));
  
      const user = await authService.registerUser(req.body);
      res.json(apiResponse(true, 'User registered successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };

  exports.login = async (req, res) => {
   
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) return res.status(400).json(apiResponse(false, error.message));
      
      let meta = {
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      }
      const user = await authService.loginUser(req.body, meta);
      res.json(apiResponse(true, 'User logged in successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };

  exports.logout = async (req, res) => {
    try {

      let userId = req.user.id;
        let meta = {
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      }
      
      const user = await authService.logoutUser(userId, meta);
      res.json(apiResponse(true, 'User logged out successfully', user));
    } catch (err) {
      res.status(400).json(apiResponse(false, err.message));
    }
  };

