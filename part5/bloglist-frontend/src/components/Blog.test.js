// 5.13: Blog list tests, step1
// Make a test which checks that the component displaying a Blog renders the blog's title and author, but does not render its url or number of likes by default.

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("Blog renders the blog's title and author, but does not render its url or number of likes by default", () => {
  const blog = {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    __v: 0
  };

  const component = render(<Blog blog={blog} />);

  expect(component.container).toHaveTextContent(blog.title);
  expect(component.container).toHaveTextContent(blog.author);
  expect(component.container).not.toHaveTextContent(blog.url);
  expect(component.container).not.toHaveTextContent(`Likes: ${blog.likes}`);
});

test("url and number of likes are shown when 'view' has been clicked", () => {
  const blog = {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    user: { username: "TheSylvester", id: "5a422b891b54a676234d29eb" },
    __v: 0
  };

  const component = render(<Blog blog={blog} />);

  const button = component.getByText("view");
  fireEvent.click(button);

  expect(component.container).toHaveTextContent(blog.url);
  expect(component.container).toHaveTextContent(`Likes: ${blog.likes}`);

  // does not render its url or number of likes by default
});

test("if the like button is clicked twice, the event handler the component received as props is called twice", () => {
  const blog = {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    user: { username: "TheSylvester", id: "5a422b891b54a676234d29eb" },
    __v: 0
  };

  const component = render(<Blog blog={blog} />);

  const button = component.getByText("like");
  fireEvent.click(button);

  expect(component.container).toHaveTextContent(blog.url);
  expect(component.container).toHaveTextContent(`Likes: ${blog.likes}`);

  // does not render its url or number of likes by default
});
