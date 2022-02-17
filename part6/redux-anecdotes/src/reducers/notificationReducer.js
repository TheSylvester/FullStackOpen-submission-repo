import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: "", timer: 0 };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    changeNotification: (state, action) => {
      return { message: action.payload.message, timer: action.payload.timer };
    },
    clearNotification: (state, action) => {
      return { message: "", timer: 0 };
    }
  }
});

export const { changeNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, timeInSeconds) => {
  return async (dispatch, getState) => {
    const timerID = getState().notification.timer;
    timerID && clearTimeout(timerID);
    const newTimer = setTimeout(
      () => dispatch(clearNotification()),
      timeInSeconds * 1000
    );
    dispatch(changeNotification({ message, timer: newTimer }));
  };
};

export default notificationSlice.reducer;
