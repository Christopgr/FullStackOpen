import React, { useEffect, useState } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const Filter = ({ phonebookFilter, filterResults }) => (
    <div> filter shown with
        <input value={phonebookFilter} onChange={filterResults} />
    </div>
)

const PersonForm = ({ addName, newName, handleChangeName, newNumber, handleChangeNumber }) => (
    <form onSubmit={addName}>
        <div>
            name:
                    <input value={newName} onChange={handleChangeName} />
        </div>
        <div>number:
                    <input value={newNumber} onChange={handleChangeNumber} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

const Persons = ({ personsToShow, handleDelete }) => (
    <>
        {
            personsToShow.map((person) => (
                <div key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
                </div>
            ))
        }
    </>
)

const App = () => {


    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [phonebookFilter, setFilter] = useState('')
    const [message, setMessage] = useState([])

    const hook = () => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }

    useEffect(hook, []);

    const handleDelete = (id, name) => {
        const result = window.confirm(`Delete ${name}?`);
        if (result) {
            personsService
                .remove(id)
                .then(response => {
                    setPersons(persons.filter(person => person.id !== id))
                })
                .catch(error => {
                    const messageObject = {
                        msg: `${name} was already deleted`,
                        class: 'error'
                    }
                    setMessage(messageObject)
                    setTimeout(() => { setMessage([]) }, 5000)

                })
        }
    }

    const handleChangeName = (event) => {
        setNewName(event.target.value)
    }

    const handleChangeNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const addName = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber
        }

        let exists = false;

        persons.forEach(person => {
            if (person.name === newName) {
                if (window.confirm(` ${person.name} is already added to phonebook, replace the old number with a new one?`)) {
                    personsService
                        .update(person.id, personObject)
                        .then(response => {
                            const messageObject = {
                                msg: `Number updated`,
                                class: 'success'
                            }
                            setMessage(messageObject)
                            setTimeout(() => { setMessage([]) }, 5000)
                            setPersons(persons.map(p => p.id !== person.id ? p : response))
                        })
                }
                exists = true;
            }
        })

        if (!exists) {
            personsService
                .create(personObject)
                .then(returnedPerson => {
                    const messageObject = {
                        msg: `Added ${returnedPerson.name}`,
                        class: 'success'
                    }
                    setMessage(messageObject)
                    setTimeout(() => { setMessage([]) }, 5000)
                    setPersons(persons.concat(returnedPerson))
                    setNewName("")
                    setNewNumber("")
                })

        }
    }

    const filterResults = (event) => {
        setFilter(event.target.value)
    }

    const personsToShow = phonebookFilter === ""
        ? persons
        : persons.filter(person => person.name.toUpperCase().includes(phonebookFilter.toUpperCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message.msg} messageClass={message.class} />
            <Filter phonebookFilter={phonebookFilter} filterResults={filterResults} />
            <h2>add a new</h2>
            <PersonForm addName={addName} newName={newName} handleChangeName={handleChangeName} newNumber={newNumber} handleChangeNumber={handleChangeNumber} />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
        </div>
    )
}

export default App
