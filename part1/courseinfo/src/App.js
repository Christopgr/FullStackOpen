import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [message, setMessage] = useState([])

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
        }
        noteService.create(noteObject)
            .then(returnedNote => {
                const messageObject = {
                    msg: `Added ${returnedNote.content}`,
                    class: 'success'
                }
                setMessage(messageObject)
                setTimeout(() => { setMessage([]) }, 5000)
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    const toggleImportanceOf = (id) => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService.update(id, changedNote)
            .then(updatedNote => {
                const messageObject = {
                    msg: `Updated ${changedNote.content}`,
                    class: 'success'
                }
                setMessage(messageObject)
                setTimeout(() => { setMessage([]) }, 5000)
                setNotes(notes.map(note => note.id !== id ? note : updatedNote))
            })
            .catch(error => {
                const messageObject = {
                    msg: `${changedNote.content} was already removed from the server`,
                    class: 'success'
                }
                setMessage(messageObject)
                setTimeout(() => { setMessage([]) }, 5000)
                setNotes(notes.filter(n => n.id !== id))
            })


    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important === true)

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={message.msg} messageClass={message.class} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
        </div >
    )
}

export default App