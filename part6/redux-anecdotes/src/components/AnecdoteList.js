import { connect } from "react-redux";
import { upvote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import { setFilter } from "../reducers/filterReducer";
import ConnectedFilter from "./Filter";

const AnecdoteList = (props) => {
  const allAnecdotes = props.anecdotes;

  let anecdotes = [...allAnecdotes];

  return (
    <div>
      <ConnectedFilter />
      {anecdotes
        .filter((x) => x.content.includes(props.filter))
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button
                onClick={() => {
                  props.upvote(anecdote.id);
                  props.setNotification(`you upvoted "${anecdote.content}"`, 5);
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  };
};

const mapDispatchToProps = {
  upvote,
  setNotification,
  setFilter
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);

export default ConnectedAnecdoteList;
