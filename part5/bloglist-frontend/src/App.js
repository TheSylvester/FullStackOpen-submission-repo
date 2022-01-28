import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import AlertBox from "./components/AlertBox";
// import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

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
      const user = await loginService.login({
        username,
        password
      });

      // save user to local storage
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      // later we need to set the token somewhere in blogService for ease of use

      setUser(user);
      setUsername("");
      setPassword("");

      displayAlert("Login Successful!", "success");
    } catch (exception) {
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
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

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const response = await blogService.create({
        title,
        author,
        url
      });

      setTitle("");
      setUrl("");
      setAuthor("");

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

  const CreateBlogForm = ({ author, title, url }) => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            title:{" "}
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    );
  };

  const BlogSection = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <AlertBox message={alertMessage} status={alertStatus} />
      {user === null && LoginForm()}
      {user !== null && LogoutComponent({ setUser, user })}
      {user !== null && CreateBlogForm({ title, author, url })}
      {user !== null && BlogSection()}
    </div>
  );
};

export default App;
