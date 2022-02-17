import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter(state, action) {
      return action.payload;
    }
  }
});

export const { updateFilter } = filterSlice.actions;

export const setFilter = (filterText) => (dispatch) => {
  dispatch(updateFilter(filterText));
};

export default filterSlice.reducer;
