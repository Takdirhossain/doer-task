const AppError = require("../utils/AppError");

const validateBody = (schema, options = {}) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,       // report all errors
    allowUnknown: false,     // disallow unknown keys
    presence: "required",    // all keys required
    ...options,
  });

  if (error) {
    const unknownKeyErrors = error.details.filter(
      (d) => d.type === "object.unknown"
    );

    let message;
    if (unknownKeyErrors.length > 0) {
      message = `Unknown field(s): ${unknownKeyErrors
        .map((d) => d.context.key)
        .join(", ")}`;
    } else {
      message = error.details.map((d) => d.message).join(", ");
    }

    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};

module.exports = validateBody;
