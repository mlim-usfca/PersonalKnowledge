import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./system/Login";
import Register from "./system/Register";
import Reset from "./system/Reset";
import Dashboard from "./system/Dashboard";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;