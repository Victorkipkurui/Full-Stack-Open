import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import './index.css';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="message">{message}</div>;
};


const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

const Filter = ({ search, handleSearch }) => {
  return (
    <>
      search by name: <input type="text" placeholder="search" value={search} onChange={handleSearch} />
      <button className='search'>Search</button>
    </>
  );
};

const PersonForm = ({ newName, number, handleNameChange, handleNumberChange, addName }) => {
  return (
    <>
      <form onSubmit={addName}>
        <div className='name'>
          name: <input placeholder="input name" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input placeholder="number" value={number} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" className='add'>add</button>
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
            <button onClick={() => handleDelete(person.id)} className='del'>Delete</button>
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
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
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
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) => (person.id !== nameExists.id ? person : returnedPerson))
            );
            setNotification(`Updated ${returnedPerson.name}`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);

            setNewName('');
            setNumber('');
          })
          .catch((error) => {
            setErrorMessage(`Information of  '${nameExists.name}' has already been removed from the server`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: number,
      };

      personsService
        .create(personObject)
        .then((returnedObject) => {
          setPersons(persons.concat(returnedObject));
          setNotification(`Added ${personObject.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);

          setNewName('');
          setNumber('');
        })
        .catch((error) => {
          setErrorMessage('Failed to add person due to server error.');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deleteObject(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setErrorMessage(`Failed to delete '${personToDelete.name}' due to server error.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />
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
