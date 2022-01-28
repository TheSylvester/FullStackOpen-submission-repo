import React from "react";
const LoginForm = ({
  submitHandler,
  username,
  setUsername,
  password,
  setPassword
}) => (
  <div>
    <h2>log in to application</h2>
    <form onSubmit={submitHandler}>
      <div>
        username:{" "}
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        username:{" "}
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
);

export default LoginForm;
