import React, { useState, useEffect } from 'react';
import personsService from './services/persons';

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

const Person = ({ persons, handleDelete }) => {

  return (
    <>
      {persons.length > 0 ? (
        persons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
            <button onClick={()=>{handleDelete(person.id)}}>Delete</button>
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
    personsService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
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
    const nameExists = persons.find((person) => person.name === newName);

    if (nameExists) {
      const confirmUpdate = window.confirm(
        `${nameExists.name} is already added to phonebook, replace the old number with the new one?`
      );
  
      if (confirmUpdate) {
        const updatedPerson = { ...nameExists, number: number };
  
        personsService
          .update(nameExists.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id !== nameExists.id ? person : returnedPerson
            ));
            setNewName('');
            setNumber('');
          })
          .catch(error => {
            console.error('Error updating person:', error);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: number,
      };
  
      personsService
        .create(personObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject));
          setNewName('');
          setNumber('');
        })
        .catch(error => {
          console.error('Error creating person:', error);
        });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deleteObject(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
        });
    }
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
      <Person persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
