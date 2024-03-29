const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from bearer token in headers
    token = req.headers.authorization.split(" ")[1];
  }
  // Set token from cookie
  //else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorised to access this route", 401));
  } else {
    try {
      //   Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorised to access this route", 401)
      );
    }
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role of ${req.user.role} is not authorised to access this role`,
          403
        )
      );
    }
    next();
  };
};
