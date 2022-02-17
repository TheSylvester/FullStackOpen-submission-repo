import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    changeNotification: (state, action) => {
      return action.payload;
    },
    clearNotification: (state, action) => {
      return "";
    }
  }
});

export const { changeNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(changeNotification(message));
    setTimeout(() => dispatch(clearNotification()), timeInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
