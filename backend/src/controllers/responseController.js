const errorResponse = (res, {statusCode = 500, message = "Internal Server Error"}) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}

const successResponse = (res, {statusCode = 200, message = "Success", payload = {}}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        payload,
    });
}

const authErrorResponse = (res, { statusCode = 401, message = "Authentication failed", errors = [] }) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  };

module.exports = { errorResponse, successResponse, authErrorResponse };