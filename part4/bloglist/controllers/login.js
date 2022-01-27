const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response, next) => {
  // take the input username and password and compare it with the password in mongodb
  const body = request.body;
  const user = await User.findOne({ username: body.username });
  if (!user) {
    return response.status(401).json({ error: "invalid username" });
  }
  if (!(await bcrypt.compare(body.password, user.passwordHash))) {
    return response.status(401).json({ error: "invalid password" });
  }

  const userToTokenize = {
    username: user.username,
    id: user._id
  };

  const token = jwt.sign(userToTokenize, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
