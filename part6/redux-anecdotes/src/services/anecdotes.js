import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const object = { content, id: getId(), votes: 0 };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const update = async (anecdote) => {
  const id = anecdote.id;
  const response = await axios.put(`${baseUrl}/${id}`, anecdote);
  return response.data;
};

const anecdotes = { getAll, createNew, update };

export default anecdotes;
