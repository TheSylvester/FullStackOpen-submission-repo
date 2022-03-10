const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.post("/reset/", async (_request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(200).end();
});

// router.get("/reset/", (_request, response) => {
//   console.log("we testin the reset");

//   response.status(200).end();
// });

module.exports = router;
