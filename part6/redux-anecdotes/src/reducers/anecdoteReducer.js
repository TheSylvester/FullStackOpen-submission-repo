import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    updateAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    }
  }
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (anecdoteText) => {
  return async (dispatch) => {
    const response = await anecdoteService.createNew(anecdoteText);
    dispatch(appendAnecdote(response));
  };
};

export const upvote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToUpvote = getState().anecdotes.find((x) => x.id === id);
    let upvotedAnecdote = {
      ...anecdoteToUpvote,
      votes: anecdoteToUpvote.votes + 1
    };
    await anecdoteService.update(upvotedAnecdote);
    dispatch(updateAnecdote(upvotedAnecdote));
  };
};

export default anecdoteSlice.reducer;
