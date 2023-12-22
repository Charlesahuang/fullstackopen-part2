import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Filter by name: <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addPerson,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map((person) => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id)}>Delete</button>
      </div>
    ))}
  </>
);

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        axios
          .put(
            `http://localhost:3001/persons/${existingPerson.id}`,
            updatedPerson
          )
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? response.data : person
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${response.data.name}`);
          })
          .catch((error) => {
            console.error("Error updating entry:", error);
            showNotification(`Error updating ${existingPerson.name}`);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      axios
        .post("http://localhost:3001/persons", newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
          showNotification(`Added ${response.data.name}`);
        })
        .catch((error) => {
          console.error("Error adding entry:", error);
          showNotification(`Error adding ${newName}`);
        });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (personToDelete) {
      const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`);

      if (confirmDelete) {
        axios
          .delete(`http://localhost:3001/persons/${id}`)
          .then(() => {
            setPersons(persons.filter((person) => person.id !== id));
            showNotification(`Deleted ${personToDelete.name}`);
          })
          .catch((error) => {
            console.error("Error deleting entry:", error);
            showNotification(
              `Information of ${personToDelete.name} has already been removed from server`
            );
          });
      }
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
