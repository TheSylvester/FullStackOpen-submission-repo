import React, { useState, useEffect } from 'react'
import personService from './services/persons.js'

const Person = (props) => {

  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.number}</td>
      <td><button onClick={props.deleter}>delete</button></td>
    </tr>
  );
};

const Numbers = ({people, filtertext, updater, handleAlert}) => {

  const regex = new RegExp(filtertext !== '' ? filtertext : ".", "i");
  const filteredPersons = people.filter( x => regex.test(x.name) );

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return;
    personService
      .remove(id)
      .then( () => {
        updater( people.filter( x => x.id !== id ) );
        handleAlert(`${name} deleted`, 'success');
      });
  };

  const content = filteredPersons
    .map( x => <Person key={x.id} name={x.name} number={x.number} deleter={() => handleDelete(x.id, x.name)} /> );

  return (
    <table>
      <tbody>
      {content}
      </tbody>
    </table>
  );
};

const Filter = ({value: newFilter, handleChange: handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={newFilter} onChange={handleFilterChange} />
    </div>
  );
};

const NewPersonForm = ({onSubmit: handleAddPerson, 
  nameValue: newName, nameOnChange: handleNameChange,
  numberValue: newNumber, numberOnChange: handleNumberChange,
}) => {
  return (
    <form onSubmit={handleAddPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const AlertBox = ({message, status}) => {
  
  if (message === null) return null;

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  const cssStyle = ( status === 'success' ? successStyle : errorStyle );
  
  return (
    <div style={cssStyle}>
      {message}
    </div>
  );
};



const App = () => {

  const [persons, setPersons] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);

  useEffect(() => {
    personService
      .get()
      .then( receivedPersons => {
        setPersons(receivedPersons)
      });
  }, []);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const handleAlert = (message, status) => {
    setAlertStatus(status);
    setAlertMessage(message);
    setTimeout( () => {
      setAlertMessage(null);
    }, 5000);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();

    const names = persons.map( x => x.name );

    if (names.some( e => e === newName )) {
      if (!window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) return;

      const personToUpdate = persons.find( x => x.name === newName );
      
      personService.update(
        personToUpdate.id,
        { name: personToUpdate.name, number: newNumber, id: personToUpdate.id }
      ).then( updatedPerson => {
        setPersons(persons.map( x => x.id === updatedPerson.id ? updatedPerson : x ));
        setNewName('');
        setNewNumber('');

        handleAlert(`${personToUpdate.name} updated with new number`, 'success');
      }).catch( error => {
        handleAlert(`Information of ${personToUpdate.name} has already been removed from server: ${error}`);
        setPersons(persons.filter( x => x.id !== personToUpdate.id ));
        setNewName('');
        setNewNumber('');
      });

      return;
    }

    const newId = persons.map( x=> x.id ).reduce( (a, b) => (a > b ? a : b) ) + 1;
    const newPerson = { name: newName, number: newNumber, id: newId };

    personService
      .add(newPerson)
      .then( returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');

        handleAlert(`Added ${newPerson.name}`, 'success');
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <AlertBox message={alertMessage} status={alertStatus} />

      <Filter value={newFilter} handleChange={handleFilterChange} />
      
      <h3>Add a new</h3>

      <NewPersonForm
        onSubmit={handleAddPerson}
        nameValue={newName} nameOnChange={handleNameChange}
        numberValue={newNumber} numberOnChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Numbers people={persons} filtertext={newFilter} updater={setPersons} handleAlert={handleAlert} />
    </div>
  );
}

export default App
