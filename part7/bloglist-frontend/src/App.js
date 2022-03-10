import React, { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AlertBox from "./components/AlertBox";
import Toggleable from "./components/Toggleable";
import CreateBlogForm from "./components/CreateBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { setBlogs, updateBlog } from "./reducers/blogsReducer";
import { setUser } from "./reducers/userReducer";
import { setUsers } from "./reducers/usersReducer";
import { Link, useMatch, Routes, Route } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const response = useSelector((state) => state.blogs);
  let blogs = [...response];

  const blogFormRef = useRef();

  useEffect(() => {
    const localStorageUser = JSON.parse(
      window.localStorage.getItem("loggedBloglistUser") // returns JSON
    );

    if (!localStorageUser) return null;

    dispatch(setUser(localStorageUser));
    blogService.setToken(localStorageUser.token);
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  const LoginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input type="text" name="username" />
          </div>
          <div>
            password:
            <input type="password" name="password" />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const username = event.target.username.value;
      const password = event.target.password.value;

      const loggedInUser = await loginService.login({
        username,
        password
      });

      // save user to local storage
      window.localStorage.setItem(
        "loggedBloglistUser",
        JSON.stringify(loggedInUser)
      );
      blogService.setToken(loggedInUser.token);
      dispatch(setUser(loggedInUser));

      event.target.username.value = "";
      event.target.password.value = "";

      displayAlert("Login Successful!", "success");
    } catch (exception) {
      displayAlert("Invalid Username or Password", "fail");
    }
  };

  const displayAlert = (message, status, delay = 5000) => {
    dispatch(setNotification(message, status, delay));
  };

  const LogoutComponent = () => {
    if (!user) return null;

    const handleLogout = () => {
      window.localStorage.removeItem("loggedBloglistUser");
      // window.localStorage.clear()
      dispatch(setUser(null));
    };

    return (
      <span>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </span>
    );
  };

  const handleCreateBlog = async (title, author, url) => {
    try {
      blogFormRef.current.toggleVisible();
      const response = await blogService.create({
        title,
        author,
        url
      });

      const updatedBlogsList = blogs.concat(response);
      dispatch(setBlogs(updatedBlogsList));
      displayAlert(
        `a new blog ${response.title} by ${response.author} added`,
        "success"
      );
    } catch (error) {
      displayAlert("error", "fail");
    }
  };

  const BlogSection = () => {
    return (
      <div>
        <h2>blog app</h2>
        <ToggleableCreateBlogForm />
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
      </div>
    );
  };

  const ToggleableCreateBlogForm = () => {
    return (
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateBlogForm createBlog={handleCreateBlog} />
      </Toggleable>
    );
  };

  const Home = () => {
    return (
      <div>
        <BlogSection />
      </div>
    );
  };

  const Users = () => {
    useEffect(() => {
      usersService.getAll().then((response) => {
        dispatch(setUsers(response));
      });
    }, []);

    const users = useSelector((state) => state.users);

    if (!users) return null;

    const usersTable = users.map((user) => (
      <tr key={user.name}>
        <td>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </td>
        <td>{user.blogs.length}</td>
      </tr>
    ));

    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <strong>blogs created</strong>
              </td>
            </tr>
            {usersTable}
          </tbody>
        </table>
      </div>
    );
  };

  const BlogSingleView = ({ id }) => {
    const blog = useSelector((state) => state.blogs.find((x) => x.id === id));

    if (!blog) return null;

    const handleLike = async (blogToUpdate) => {
      const response = await blogService.update(blogToUpdate);
      if (response) dispatch(updateBlog(blogToUpdate));
    };

    const handleSubmitComment = async (event) => {
      event.preventDefault();

      const comment = event.target.comment.value;

      const response = await blogService.addComment({
        blogid: id,
        commentObject: { comment }
      });

      const reduxBlog = { ...blog, comments: [...blog.comments, comment] };

      if (response) dispatch(updateBlog(reduxBlog));
      //console.log(response);
    };

    return (
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
        <div>
          <a href={blog.url} rel="noreferrer" target="_blank">
            {blog.url}
          </a>
        </div>
        <div>
          <strong>
            {blog.likes} likes{" "}
            <button
              onClick={() => handleLike({ ...blog, likes: blog.likes + 1 })}
            >
              Like
            </button>
          </strong>
        </div>
        <div>
          <strong>added by {blog.user.name}</strong>
        </div>
        <h3>comments:</h3>
        <form onSubmit={handleSubmitComment}>
          <input name="comment" type="text" />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments
            ? blog.comments.map((comment) => <li key={comment}>{comment}</li>)
            : null}
        </ul>
      </div>
    );
  };

  const NavBar = () => {
    const cssStyle = {
      paddingRight: 10
    };
    return (
      <div>
        <Link to="/" style={cssStyle}>
          blogs
        </Link>
        <Link to="/users" style={cssStyle}>
          users
        </Link>
        <LogoutComponent style={cssStyle} />
      </div>
    );
  };

  const UserSingleView = ({ id }) => {
    useEffect(() => {
      usersService.getAll().then((response) => {
        dispatch(setUsers(response));
      });
    }, []);

    const user = useSelector((state) =>
      state.users.find((user) => user.id === id)
    );

    if (!user) return null;

    const blogList = user.blogs.map((blog) => (
      <li key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </li>
    ));

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>{blogList}</ul>
      </div>
    );
  };

  const matchUsers = useMatch("/users/:id");
  const matchBlogs = useMatch("/blogs/:id");

  return (
    <div>
      {user && NavBar()}

      <AlertBox />
      <Routes>
        <Route path="/" element={user ? <Home /> : <LoginForm />} />
        <Route path="/users" element={user ? <Users /> : <LoginForm />} />
        <Route
          path="/users/:id"
          element={
            <UserSingleView id={matchUsers ? matchUsers.params.id : null} />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogSingleView id={matchBlogs ? matchBlogs.params.id : null} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
