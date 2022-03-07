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
    }
  }
});

export const { appendBlog, setBlogs } = blogsSlice.actions;
export default blogsSlice.reducer;
