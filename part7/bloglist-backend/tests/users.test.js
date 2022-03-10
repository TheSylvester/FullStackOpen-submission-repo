const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const mongoose = require("mongoose");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    // const users_before_delete = helper.usersInDb();
    // if ((await users_before_delete).length > 0) await User.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "root user",
      passwordHash
    });

    await user.save();
  }, 10000);

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  }, 10000);
});

test("username must be at least 3 characters long", async () => {
  const usersAtStart = await helper.usersInDb();
  const newUserBadUsername = {
    username: "ml",
    name: "Matti Luukkainen",
    password: "salainen"
  };

  await api.post("/api/users").send(newUserBadUsername).expect(400);
  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test("username must be unique", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "TheMatster",
    name: "Matti Luukkainen",
    password: "salainen"
  };

  await api.post("/api/users").send(newUser).expect(200);
  await api.post("/api/users").send(newUser).expect(400);
  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1); // we actually added 1, the first one, not the 2nd
});

test("Password must be at least 3 characters long", async () => {});

afterAll(() => {
  mongoose.connection.close();
});
