import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, {
    headers: { Authorization: token }
  });
  return response.data;
};

const remove = async (blogid) => {
  const response = await axios.delete(`${baseUrl}/${blogid}`, {
    headers: { Authorization: token }
  });
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, {
    headers: { Authorization: token }
  });
  return response.data;
};

const blogService = { setToken, getAll, create, update, remove };

export default blogService;
