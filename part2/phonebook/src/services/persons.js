import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'


const add = newPerson => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(response => response.data);
};

const get = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};


const update = (id, newPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson);
  return request.then(response => response.data);
};

const remove = id => {
  const request = axios.delete(baseUrl + '/' + id);
  return request.then(response => response.data);
};

const personService = { get, add, update, remove };

export default personService;