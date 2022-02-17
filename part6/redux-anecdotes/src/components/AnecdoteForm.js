import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import anecdoteService from "../services/anecdotes";

import {
  setNotification,
  clearNotification
} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const insertNewAnecdote = async (event) => {
    event.preventDefault();

    const anecdoteText = event.target.newAnecdote.value;
    event.target.newAnecdote.value = "";

    dispatch(createAnecdote(anecdoteText));
    dispatch(setNotification(`"${anecdoteText}" added to list`, 5));
  };

  return (
    <form onSubmit={insertNewAnecdote}>
      <h2>create new</h2>
      <div>
        <input name="newAnecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AnecdoteForm;
