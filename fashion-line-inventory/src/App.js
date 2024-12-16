// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Management from './pages/Management';
import Inventory from './pages/Inventory';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="Management" element={<Management />} />
        <Route path="Management" element={<Management />} /> 
        <Route path="Inventory" element={<Inventory />} />  
      </Routes>
    </Router>
  );
};

export default App;
