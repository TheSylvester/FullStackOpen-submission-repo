const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
];

beforeEach(async () => {
  // create a user, too, so we can log in somehow later
  await api.post("/api/users").send({
    username: "root",
    name: "root user",
    password: "sekret"
  });

  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 20000);

describe("blogs HTTP GET", () => {
  test("blogs are returned in the json format", async () => {
    const response = await api.get("/api/blogs");
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("all blogs return have id property defined", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((x) => expect(x.id).toBeDefined());
  });
});

describe("blogs HTTP POST", () => {
  test("when an HTTP POST request is made with no token, you get 401", async () => {
    await api
      .post("/api/blogs")
      .send({
        _id: "5a422bc61b54a676234d17fd",
        title: "Swift Floors",
        author: "Sylvester Wong",
        url: "http://thesylvester.github.io",
        likes: 3,
        __v: 0
      })
      .expect(401);
  });

  test("when an HTTP POST request is made, a new blog post is created and total blogs is +1", async () => {
    // login to get token
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    const token = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .set("authorization", `bearer ${token}`)
      .send({
        _id: "5a422bc61b54a676234d17fd",
        title: "Swift Floors",
        author: "Sylvester Wong",
        url: "http://thesylvester.github.io",
        likes: 3,
        __v: 0
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const allTitles = response.body.map((x) => x.title);
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(allTitles).toContain("Swift Floors");
  });

  test("when an HTTP POST request is made without the likes property, likes defaults to 0", async () => {
    // login to get token
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    const token = loginResponse.body.token;

    const newBlog = {
      _id: "5a422bc61b54a676234d17fd",
      title: "Swift Floors",
      author: "Sylvester Wong",
      url: "http://thesylvester.github.io",
      __v: 0
    };

    await api
      .post("/api/blogs")
      .set("authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const saved = response.body.find((post) => post.id === newBlog._id);
    expect(saved.likes).toBe(0);
  });

  test("if the title and url properties are missing, status code 400 Bad Request", async () => {
    const newBlog = {
      _id: "5a422bc61b54a676234d17fd",
      author: "Sylvester Wong",
      likes: 5,
      __v: 0
    };

    // login to get token
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    const token = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .set("authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 5000);
});

describe("HTTP PUT request", () => {
  test("when I send a PUT request I get back # of likes + 1", async () => {
    const response = await api
      .put("/api/blogs/5a422a851b54a676234d17f7")
      .send({
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
      })
      .expect(200);
    expect(response.body.likes).toBe(8);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
