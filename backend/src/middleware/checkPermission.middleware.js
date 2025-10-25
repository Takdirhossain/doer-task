const AppError = require("../utils/AppError");
const {checkRolePermission} = require("../modules/authorization/authorization.service");

const checkPermission = (permissionName, moduleName) => {
    return async(req, res, next) => {
        const userId = req.user.id;
        const hasPermission = await checkRolePermission({
            userId,
            permissionName,
            moduleName
        })
        if (!hasPermission) {
            return next(new AppError("You do not have permission to access this resource", 403));
        }
        next();
    }
    
}
module.exports = checkPermission;