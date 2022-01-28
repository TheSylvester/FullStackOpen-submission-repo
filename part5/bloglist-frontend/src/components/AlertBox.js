import React from "react";

const AlertBox = ({ message, status }) => {
  if (message === "") return null;

  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  const cssStyle = status === "success" ? successStyle : errorStyle;

  return <div style={cssStyle}>{message}</div>;
};

export default AlertBox;
