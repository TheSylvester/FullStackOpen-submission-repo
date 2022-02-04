import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AlertBox from "./components/AlertBox";
import Toggleable from "./components/Toggleable";
import CreateBlogForm from "./components/CreateBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    const localStorageUser = JSON.parse(
      window.localStorage.getItem("loggedBloglistUser") // returns JSON
    );

    if (!localStorageUser) return null;

    setUser(localStorageUser);
    blogService.setToken(localStorageUser.token);
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const LoginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
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
      setUser(loggedInUser);
      setUsername("");
      setPassword("");

      displayAlert("Login Successful!", "success");
    } catch (exception) {
      displayAlert("Invalid Username or Password", "fail");
    }
  };

  const displayAlert = (message, status, delay = 5000) => {
    setAlertMessage(message);
    setAlertStatus(status);
    setTimeout(() => setAlertMessage(""), delay);
  };

  const LogoutComponent = ({ setUser, user }) => {
    const handleLogout = () => {
      window.localStorage.removeItem("loggedBloglistUser");
      // window.localStorage.clear()
      setUser(null);
    };

    return (
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>
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
      setBlogs(updatedBlogsList);
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
        <h2>blogs</h2>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
      </div>
    );
  };

  const toggleableCreateBlogForm = () => {
    return (
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateBlogForm createBlog={handleCreateBlog} />
      </Toggleable>
    );
  };

  return (
    <div>
      <AlertBox message={alertMessage} status={alertStatus} />

      {user === null && LoginForm()}

      {user !== null && LogoutComponent({ setUser, user })}
      {user !== null && toggleableCreateBlogForm()}
      {user !== null && BlogSection()}
    </div>
  );
};

export default App;
