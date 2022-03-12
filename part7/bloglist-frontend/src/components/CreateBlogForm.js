import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Container,
  TextField,
  Paper,
  Button
} from "@material-ui/core";

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreateBlog = (event) => {
    event.preventDefault();
    createBlog(title, author, url);
    setTitle("");
    setUrl("");
    setAuthor("");
  };

  return (
    <Grid container justifyContent="center">
      <Paper style={{ padding: 20 }}>
        <Container component="form" onSubmit={handleCreateBlog} maxWidth="xs">
          <Typography variant="subtitle1" color="primary">
            create new
          </Typography>
          <TextField
            label="title:"
            required
            fullWidth
            style={{ margin: 0 }}
            autoFocus
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author:"
            fullWidth
            style={{ margin: 0 }}
            required
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url:"
            required
            type="text"
            fullWidth
            style={{ margin: 0 }}
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
          <Box textAlign="center" p={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              style={{ margin: "auto" }}
            >
              create
            </Button>
          </Box>
        </Container>
      </Paper>
    </Grid>
  );
};

export default CreateBlogForm;
