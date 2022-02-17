import { connect } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const Filter = (props) => {
  return (
    <form>
      filter{" "}
      <input
        type="text"
        name="filter"
        value={props.filter}
        onChange={(event) => props.setFilter(event.target.value)}
      />
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    filter: state.filter
  };
};

const mapDispatchToProps = {
  setFilter
};

const ConnectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter);

export default ConnectedFilter;
