import { connect } from "react-redux";

import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
  const insertNewAnecdote = async (event) => {
    event.preventDefault();

    const anecdoteText = event.target.newAnecdote.value;
    event.target.newAnecdote.value = "";

    props.createAnecdote(anecdoteText);
    props.setNotification(`"${anecdoteText}" added to list`, 5);
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

const mapDispatchToProps = {
  createAnecdote,
  setNotification
};

const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);

export default ConnectedAnecdoteForm;
