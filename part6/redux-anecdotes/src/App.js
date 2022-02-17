import React, { useEffect } from "react";
import ConnectedAnecdoteForm from "./components/AnecdoteForm";
import ConnectedAnecdoteList from "./components/AnecdoteList";
import ConnectedNotification from "./components/Notification";

import { useDispatch } from "react-redux";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <ConnectedNotification />
      <ConnectedAnecdoteList />
      <ConnectedAnecdoteForm />
    </div>
  );
};

export default App;
