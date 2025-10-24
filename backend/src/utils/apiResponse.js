module.exports = (success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return response;
};
