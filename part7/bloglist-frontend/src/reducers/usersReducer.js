import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => action.payload
  }
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
