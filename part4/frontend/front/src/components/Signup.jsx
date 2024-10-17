import { useState } from 'react'
import axios from 'axios'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/signup', { username, password })
      console.log(response.data)
    } catch (error) {
      setError(error, 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 w-full hover:bg-blue-600"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center">
            Already have an account?
            <a href="/login" className="text-blue-500 hover:underline m-2">Login</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup