import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { upvote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  clearNotification
} from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const [filter, setFilter] = useState("");
  const allAnecdotes = useSelector((state) => state.anecdotes);

  let anecdotes = [...allAnecdotes];
  const dispatch = useDispatch();

  return (
    <div>
      <form>
        filter{" "}
        <input
          type="text"
          name="filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </form>
      {anecdotes
        .filter((x) => x.content.includes(filter))
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button
                onClick={() => {
                  dispatch(upvote(anecdote.id));
                  dispatch(
                    setNotification(`you upvoted "${anecdote.content}"`, 5)
                  );
                }}
              >
                {" "}
                vote
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
