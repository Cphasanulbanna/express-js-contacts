const { constants } = require("../constants");

const errorHandlor = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation error",
        statusCode : 400,
        message: error.message,
        stackTrace: error.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not found",
        statusCode : 404,
        message: error.message,
        stackTrace: error.stack,
      });
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: error.message,
        stackTrace: error.stack,
      });
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: error.message,
        stackTrace: error.stack,
      });
      case constants.SERVER_ERROR:
        res.json({
          title: "Server error",
          message: error.message,
          stackTrace: error.stack,
        });
    default:
        console.log("No error")
  }
};

module.exports = errorHandlor;
