import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginService from "../services/Login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { handleLogin } = useOutletContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await LoginService.login({ username, password });
      handleLogin(user);
    } catch (error) {
      setErrorMessage(error, "Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
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
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded py-2 w-full hover:bg-blue-600">
            Log In
          </button>
          <p className="mt-4 text-center">
            Dont have an account?
            <a href="/signup" className="text-blue-500 hover:underline m-2">Signup</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
