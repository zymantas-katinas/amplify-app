/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo, createArtwork } from './graphql/mutations'
import { listTodos, listArtworks } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }
const initialStateArt = { title: '', image: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  const [formStateArt, setFormStateArt] = useState(initialStateArt)
  const [artworks, setArtworks] = useState([])

  useEffect(() => {
    fetchTodos()
    fetchArts()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  function setInputArt(key, value) {
    setFormStateArt({ ...formStateArt, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }
  async function fetchArts() {
    try {
      const artData = await API.graphql(graphqlOperation(listArtworks))
      const artworks = artData.data.listArtworks.items
      setArtworks(artworks)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function addArtwork() {
    console.log(artworks)
    try {
      if (!formStateArt.title || !formStateArt.image) return
      const artwork = { ...formStateArt }
      setArtworks([...artworks, artwork])
      setFormStateArt(initialStateArt)
      await API.graphql(graphqlOperation(createArtwork, {input: artwork}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name} 
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>Create Todo a</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>
        ))
      }

<h2>Amplify Artworks</h2>
      <input
        onChange={event => setInputArt('title', event.target.value)}
        style={styles.input}
        value={formStateArt.title} 
        placeholder="Title"
      />
      <input
        onChange={event => setInputArt('image', event.target.value)}
        style={styles.input}
        value={formStateArt.image}
        placeholder="Image"
      />
      <button style={styles.button} onClick={addArtwork}>Create Artwork</button>
      {
        artworks.map((artwork, index) => (
          <div key={artwork.id ? artwork.id : index} style={styles.todo}>
            <p style={styles.todoName}>{artwork.title}</p>
            <p style={styles.todoDescription}>{artwork.image}</p>
          </div>
        ))
      }
    </div>


  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)