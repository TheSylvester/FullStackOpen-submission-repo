import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

const Toggleable = React.forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisible };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button size="small" variant="contained" onClick={toggleVisible}>
          {buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        <div>{children}</div>
        <Button size="small" variant="contained" onClick={toggleVisible}>
          cancel
        </Button>
      </div>
    </div>
  );
});

Toggleable.displayName = "Toggleable";

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};

export default Toggleable;
