import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import noteService from './services/notes'
import Notification from './components/Notification'


const App = () => {
  const [notes, setNotes] = useState([])
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const[noteAdded, setNoteAdded] = useState('')
  const isFirstRender = useRef(true)

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id===id)
    const changedNote = {...note, important: !note.important}

    
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNotes(notes.filter(n => n.id !== id))
      })
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
  }, [noteAdded])

  
  const Note= ({note, toggleImportance}) => {
    const label = note.important
    ? 'make not important' : 'make important'
    return (
      <li>
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    )

  }

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }

    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
      setNoteAdded('New Note Added')
      setTimeout(() => {
        setNoteAdded(null)
      }, 2000)
    })
    
    
  }
  const [newNote, setNewNote]= useState("a new note")

  const [showAll, setShowAll] = useState(true)
  const notesToShow= showAll ? notes : notes.filter(note => note.important)

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  return (
    <div>
      <h1>Notes</h1>
      {!isFirstRender.current && noteAdded && <Notification message={noteAdded} />}
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'} 
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} 
        onChange={handleNoteChange} />
         <button type='submit'>Save</button>
         </form>


    </div>
  )
}

export default App