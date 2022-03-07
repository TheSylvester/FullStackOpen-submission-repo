import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  status: "",
  timer: null
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    changeNotificationMessage(state, action) {
      return { ...state, message: action.payload };
    },
    changeNotificationStatus(state, action) {
      return { ...state, status: action.payload };
    },
    setTimerHandle(state, action) {
      return { ...state, timer: action.payload };
    },
    getTimerHandle(state) {
      return { ...state };
    },
    clearTimerHandle(state) {
      return { ...state, timer: null };
    }
  }
});

export const {
  changeNotificationMessage,
  changeNotificationStatus,
  setTimerHandle,
  getTimerHandle,
  clearTimerHandle
} = notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (message, status, duration) => {
  // this is a custom action creator
  // returns a function that takes a dispatch as an argument
  // ... and uses that dispatch to actually dispatch other actions in the store
  return (dispatch) => {
    dispatch(changeNotificationMessage(message));
    dispatch(changeNotificationStatus(status));
    const state = dispatch(getTimerHandle());

    state.timerHandle && clearTimeout(state.timerHandle);

    const timerHandle = setTimeout(() => {
      dispatch(changeNotificationMessage(""));
      dispatch(clearTimerHandle());
    }, duration);
    dispatch(setTimerHandle(timerHandle));
  };
};
