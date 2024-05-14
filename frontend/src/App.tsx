import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Candidates from './views/Candidates'; // Asegúrate de crear este componente

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<div>Aquí va el contenido principal del dashboard</div>} />
          <Route path="/candidates" element={<Candidates />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;