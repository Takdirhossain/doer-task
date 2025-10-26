const AppError = require("../utils/AppError");
const {checkRolePermission} = require("../modules/authorization/authorization.service");

const checkPermission = (permissionName, moduleName) => {
    return async(req, res, next) => {
        const userId = req.user.id;
        const role = req.user.role;
        const hasPermission = await checkRolePermission({
            role,
            permissionName,
            moduleName
        })
        if (!hasPermission) {
            return next(new AppError("You do not have permission to access this API resource", 403));
        }
        next();
    }
    
}
module.exports = checkPermission;