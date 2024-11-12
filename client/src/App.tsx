import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ParkingAreasManagement from './components/pages/ParkingAreasManagement';
import PaymentView from './components/pages/PaymentView';
import NotFound from './components/pages/NotFound';
import Navigation from './components/modules/Navigation';

function App() {
  return (
    <div className='App'>
      <Router>
        <Navigation/>
        <Routes>
          <Route path="/" element={<Navigate to="/management" replace />} />
          <Route path="/management" element={<ParkingAreasManagement />} />
          <Route path="/payment" element={<PaymentView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
