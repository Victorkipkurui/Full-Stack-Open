import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Filter = ({ search, handleSearch }) => {
  return (
    <>
      search by name: <input type="text" placeholder="search" value={search} onChange={handleSearch} />
    </>
  );
};

const PersonForm = ({ newName, number, handleNameChange, handleNumberChange, addName }) => {
  return (
    <>
      <form onSubmit={addName}>
        <div>
          name: <input placeholder="input name" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input placeholder="number" value={number} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Person = ({ persons }) => {
  return (
    <>
      {persons.length > 0 ? (
        persons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))
      ) : (
        <p>No result found</p>
      )}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/persons')
      .then((response) => {
        const data = response.data;
        setPersons(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const nameExists = persons.some((person) => person.name === newName);
    const numberExists = persons.some((person) => person.number === number);

    if (nameExists || numberExists) {
      alert(`${newName} is already added to phonebook`);
      setNewName('');
      setNumber('');
      return;
    }

    setPersons(persons.concat({ 
      name: newName, 
      number: number, 
      id: persons.length + 1 
    }));
    setNewName('');
    setNumber('');
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h2>Add new</h2>
      <PersonForm
        newName={newName}
        number={number}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Person persons={filteredPersons} />
    </div>
  );
};

export default App;
