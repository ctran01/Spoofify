import React, { useState, useEffect } from 'react'
import UserContext from './context/UserContext'
import Login from './components/Login'
import Users from './components/Users'

const apiUrl = process.env.REACT_APP_API_SERVER_BASE_URL

function App() {
  const [ users, setUsers ] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/users`)

        if (res.ok) {
          const data = await res.json()
          setUsers([...data])
        }
      } catch (err) {
        console.error(err)
      }
    }

    getUsers()
  }, [])

  const context = {
    users,
    setUsers,
  }

  return (
    <UserContext.Provider value={context} >
      <h1 style={{ fontFamily: 'Roboto', textAlign: 'center' }}>Hello from the React App!</h1>
      <Login />
      {users && <Users />}
    </UserContext.Provider>
  )
}

export default App
