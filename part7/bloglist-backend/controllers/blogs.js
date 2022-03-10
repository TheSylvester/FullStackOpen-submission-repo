const blogsRouter = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user.js");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const user = request.user; // app.use(middleware.userExtractor)

    if (!user)
      return response.status(401).json({ error: "no token presented" });

    const blogPost = {
      ...request.body,
      likes: request.body.hasOwnProperty("likes") ? request.body.likes : 0,
      user: user._id
    };
    const blog = new Blog(blogPost);
    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id); // id of the note to be stored in the notes: of user
    await user.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:id/comments/", async (request, response, next) => {
  try {
    const findById = await Blog.findById(request.params.id);
    blogToUpdate = findById.toObject();

    const updatedBlog = {
      ...blogToUpdate,
      comments: [...blogToUpdate.comments, request.body.comment]
    };

    await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
      new: true,
      runValidators: true
    });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  // decided for crippling functionality to updating 'likes' only
  // not allowing/forcing update of whole blog for future compatibility

  // const updatedBlog = request.body;
  try {
    const findById = await Blog.findById(request.params.id);
    blogToUpdate = findById.toObject();

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.hasOwnProperty("likes") ? blogToUpdate.likes + 1 : 1
    };

    await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
      new: true,
      runValidators: true
    });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const user = request.user; // app.use(middleware.userExtractor)
    if (!user)
      return response
        .status(401)
        .json({ error: "missing or invalid token for delete" });

    const blogToDelete = await Blog.findById(request.params.id);

    if (!blogToDelete)
      return response.status(400).json({ error: "blog id doesn't exist" });

    if (blogToDelete.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .json({ error: "token id does not match user id on blog post" });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
