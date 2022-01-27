const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const errorHandler = (error, _request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

const tokenExtractor = (request, _response, next) => {
  try {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      request.token = authorization.substring(7);
    } else {
      request.token = null;
    }
    next();
  } catch (error) {
    next(error);
  }
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null;
    return next();
  }
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    request.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
};
