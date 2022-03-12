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
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  createTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  Box,
  TextField,
  Typography,
  Button,
  CssBaseline,
  Container,
  IconButton,
  Grid
} from "@material-ui/core";
import { ThumbUp, ChatBubble } from "@material-ui/icons";
import NoteIcon from "@material-ui/icons/Note";

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

  const theme = createTheme();

  const LoginForm = () => {
    return (
      <Container component="div" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography component="h1" variant="h5">
            log in to application
          </Typography>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Username: "
              required
              fullWidth
              margin="normal"
              type="text"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              required
              name="password"
              type="password"
              label="Password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              login
            </Button>
          </Box>
        </Box>
      </Container>
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
        <CssBaseline />
        {user.name} logged in{" "}
        <Button
          variant="outlined"
          size="small"
          color="white"
          onClick={handleLogout}
        >
          logout
        </Button>
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
      <Box
        style={{
          backgroundColor: "white",
          padding: 20
        }}
      >
        <Typography color="primary" variant="h6">
          Blogs
        </Typography>

        <Box style={{ padding: 15 }}>
          <Box style={{ paddingBottom: 15 }}>
            <ToggleableCreateBlogForm />
          </Box>
          <List>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
          </List>
        </Box>
      </Box>
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
      <TableRow key={user.name}>
        <TableCell>
          <Button
            component={Link}
            size="small"
            to={`/users/${user.id}`}
            style={{ textTransform: "none" }}
          >
            {user.name}
          </Button>
        </TableCell>
        <TableCell align="center">{user.blogs.length}</TableCell>
      </TableRow>
    ));

    return (
      <Box
        style={{
          backgroundColor: "white",
          padding: 20
        }}
      >
        <Typography gutterBottom variant="h5" component="h2" color="primary">
          Users
        </Typography>
        <TableContainer style={{ width: "fit-content" }} component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>blogs created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{usersTable}</TableBody>
          </Table>
        </TableContainer>
      </Box>
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

    const commentsList = () =>
      blog.comments.map((comment) => {
        return (
          <ListItem key={comment}>
            <ListItemIcon>
              <ChatBubble fontSize="small" />
            </ListItemIcon>
            <ListItemText>{comment}</ListItemText>
          </ListItem>
        );
      });

    return (
      <Box
        style={{
          backgroundColor: "white",
          padding: 20
        }}
      >
        <Box display="inline-block">
          <Typography gutterBottom variant="h5" component="h2">
            {blog.title} {blog.author}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            added by {blog.user.name}
          </Typography>
          <Button
            color="primary"
            component="a"
            href={blog.url}
            rel="noreferrer"
            target="_blank"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            {blog.url}
          </Button>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Typography
                variant="h6"
                color="textSecondary"
                component="span"
                style={{ marginRight: 15 }}
              >
                {blog.likes} likes{" "}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleLike({ ...blog, likes: blog.likes + 1 })}
              >
                <ThumbUp />
              </IconButton>
            </Grid>
          </Grid>
          <Box style={{ marginTop: 30 }}>
            <Typography variant="subtitle1">comments:</Typography>
            <Box component="form" onSubmit={handleSubmitComment}>
              <TextField
                variant="outlined"
                name="comment"
                type="text"
                fullWidth
              />
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button size="small" type="submit">
                    add comment
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <List dense>{!blog.comments ? null : commentsList()}</List>
          </Box>
        </Box>
      </Box>
    );
  };

  const NavBar = () => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography
              component="div"
              variant="h6"
              color="inherit"
              style={{ flexGrow: 0, marginRight: 50 }}
              noWrap
            >
              Blog List App
            </Typography>
            <Box
              style={{
                flexGrow: 1,
                display: "flex",
                alignItems: "right"
              }}
            >
              <Button
                component={Link}
                to={"/"}
                style={{ color: "white", display: "block" }}
              >
                blogs
              </Button>
              <Button
                component={Link}
                to={"/users"}
                style={{ color: "white", display: "block" }}
              >
                users
              </Button>
            </Box>
            <LogoutComponent style={{ flexGrow: 0 }} />
          </Toolbar>
        </AppBar>
      </ThemeProvider>
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
      <ListItem key={blog.id}>
        <ListItemIcon>
          <NoteIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography component={Link} to={`/blogs/${blog.id}`}>
            {blog.title}
          </Typography>
        </ListItemText>
      </ListItem>
    ));

    return (
      <Box
        style={{
          backgroundColor: "white",
          padding: 20
        }}
      >
        <Typography gutterBottom variant="h5" component="h2">
          {user.name}
        </Typography>
        <Typography variant="subtitle1">added blogs</Typography>
        <List dense>{blogList}</List>
      </Box>
    );
  };

  const matchUsers = useMatch("/users/:id");
  const matchBlogs = useMatch("/blogs/:id");

  return (
    <div>
      {user && NavBar()}
      <Box
        component="main"
        style={{
          backgroundColor: "#DDD",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          padding: 20
        }}
      >
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
      </Box>
    </div>
  );
};

export default App;
