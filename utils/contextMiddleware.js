const jwt = require("jsonwebtoken");

const { CHAT_SECRET_KEY } = require("../config/env.json");

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, CHAT_SECRET_KEY, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  return context;
};
