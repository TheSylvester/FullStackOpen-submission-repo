import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);
  const [label, setLabel] = useState("view");
  const [likes, setLikes] = useState(blog.likes);

  const [blogStyle, setBlogStyle] = useState({
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  });

  const ShowDetails = () => {
    return (
      <div className="blog">
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
        <div>
          Likes: {likes}{" "}
          <button
            onClick={() => handleLike({ ...blog, likes: blog.likes + 1 })}
          >
            like
          </button>
        </div>
        <div>{blog.user.username}</div>
        <button
          onClick={() =>
            window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) &&
            handleDelete(blog.id)
          }
        >
          remove
        </button>
      </div>
    );
  };

  const handleShowHide = () => {
    setLabel(expanded ? "view" : "hide");
    setExpanded(!expanded);
  };

  const handleLike = async (blogToUpdate) => {
    const response = await blogService.update(blogToUpdate);
    if (response) setLikes(response.likes);
  };

  const handleDelete = async (blogidToDelete) => {
    await blogService.remove(blogidToDelete);
    setBlogStyle({ display: "none" });
  };

  return (
    <div data-cy={blog.title} style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={handleShowHide}>{label}</button>
      {expanded && ShowDetails()}
    </div>
  );
};

export default Blog;
