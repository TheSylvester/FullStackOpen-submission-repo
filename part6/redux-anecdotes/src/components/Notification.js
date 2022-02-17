import { connect } from "react-redux";
import React from "react";

const Notification = (props) => {
  const notification = props.notification;

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1
  };
  return notification ? <div style={style}>{notification}</div> : <div></div>;
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification.message
  };
};

const ConnectedNotification = connect(mapStateToProps)(Notification);
export default ConnectedNotification;
