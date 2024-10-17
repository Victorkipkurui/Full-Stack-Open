import { useState } from "react";
import BlogForm from "./components/BlogForm";
import { Outlet, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    navigate("/create-blog");
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      <Outlet context={{ isLoggedIn, handleLogin }} />
      
      {isLoggedIn ? <BlogForm user={user} /> : <p>Please log in to create a blog.</p>}
    </div>
  );
};

export default App;
