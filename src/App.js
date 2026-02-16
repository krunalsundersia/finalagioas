import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Upgrade from './pages/Upgrade';
import Dashboard from './Dashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Simulations
import Boardroom from './simulations/Boardroom';
import Vcs from './simulations/Vcs';
import Customer from './simulations/Customer';
import CeoCoach from './simulations/CeoCoach';

// Frontpages
import BoardroomFrontpage from './frontpages/BoardroomFrontpage';
import VcsFrontpage from './frontpages/VcsFrontpage';
import CustomerFrontpage from './frontpages/CustomerFrontpage';
import CeoCoachFrontpage from './frontpages/CeoCoachFrontpage';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />

        {/* SIMULATION FRONTPAGES */}
        <Route
          path="/boardroom"
          element={
            <ProtectedRoute>
              <BoardroomFrontpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vc"
          element={
            <ProtectedRoute>
              <VcsFrontpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerFrontpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ceo"
          element={
            <ProtectedRoute>
              <CeoCoachFrontpage />
            </ProtectedRoute>
          }
        />

        {/* ACTUAL SIMULATIONS */}
        <Route
          path="/boardroom/sim"
          element={
            <ProtectedRoute>
              <Boardroom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vc/sim"
          element={
            <ProtectedRoute>
              <Vcs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/sim"
          element={
            <ProtectedRoute>
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ceo/sim"
          element={
            <ProtectedRoute>
              <CeoCoach />
            </ProtectedRoute>
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;