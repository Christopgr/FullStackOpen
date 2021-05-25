import React, { useState } from 'react'

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
const Persons = ({ personsToShow }) => (
    <>
        {
            personsToShow.map((person) => (
                <div key={person.name}>{person.name} {person.number}</div>
            ))
        }
    </>
)

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [phonebookFilter, setFilter] = useState('')

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
                alert(`${newName} is already added to phonebook`)
                exists = true;
            }
        })

        if (!exists) {
            setPersons(persons.concat(personObject))
            setNewName("")
            setNewNumber("")
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
            <Filter phonebookFilter={phonebookFilter} filterResults={filterResults} />
            <h2>add a new</h2>
            <PersonForm addName={addName} newName={newName} handleChangeName={handleChangeName} newNumber={newNumber} handleChangeNumber={handleChangeNumber} />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} />
        </div>
    )
}

export default App
