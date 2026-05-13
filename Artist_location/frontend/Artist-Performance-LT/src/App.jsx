import { Routes, Route } from "react-router-dom";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import About from "./component/About";
import Contact from "./component/Contact";
import Dashboard from "./component/Dashboard";
import Account from "./component/Account";
import Register from "./component/Register";
import Login from "./component/Login";
import AdminPanel from "./component/AdminPanel";
import FanPanel from "./component/FanPanel";

import Explore from "./component/Explore";
import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/fan" element={<FanPanel />} />
      </Routes>
    </>
  );
}

export default App;
