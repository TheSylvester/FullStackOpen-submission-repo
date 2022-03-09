import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    updateBlog(state, action) {
      const blogToUpdate = action.payload;
      return state.map((blog) =>
        blog.id === blogToUpdate.id ? blogToUpdate : blog
      );
    }
  }
});

export const { appendBlog, setBlogs, updateBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
