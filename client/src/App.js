import React from "react";
import { Routes, Route } from "react-router-dom";
import BankInfo from "./components/BankInfo";
import Home from "./components/Home";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/bank-info" element={<BankInfo />} />
    </Routes>
  );
}

export default App;
