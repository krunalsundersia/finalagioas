import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { UserProvider } from './context/UserContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Upgrade from './pages/Upgrade';
import Dashboard from './Dashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Simulations (3D)
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
    <UserProvider>
      <Router>
        <Routes>

          {/* ─── PUBLIC ──────────────────────────────────────────── */}
          {/* localhost:3000         → Landing page  */}
          {/* localhost:3000/login   → Login         */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* ─── DASHBOARD ───────────────────────────────────────── */}
          {/* localhost:3000/dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ─── UPGRADE ─────────────────────────────────────────── */}
          <Route
            path="/upgrade"
            element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            }
          />

          {/* ─── BOARDROOM ───────────────────────────────────────── */}
          {/* localhost:3000/boardroom/frontpage/3d   */}
          {/* localhost:3000/boardroom/frontpage/chat */}
          <Route
            path="/boardroom/frontpage/3d"
            element={<ProtectedRoute><BoardroomFrontpage mode="3d" /></ProtectedRoute>}
          />
          <Route
            path="/boardroom/frontpage/chat"
            element={<ProtectedRoute><BoardroomFrontpage mode="chat" /></ProtectedRoute>}
          />
          <Route path="/boardroom" element={<Navigate to="/boardroom/frontpage/3d" replace />} />
          <Route path="/boardroom/sim" element={<ProtectedRoute><Boardroom /></ProtectedRoute>} />

          {/* ─── VC PITCH ────────────────────────────────────────── */}
          {/* localhost:3000/vc/frontpage/3d   */}
          {/* localhost:3000/vc/frontpage/chat */}
          <Route
            path="/vc/frontpage/3d"
            element={<ProtectedRoute><VcsFrontpage mode="3d" /></ProtectedRoute>}
          />
          <Route
            path="/vc/frontpage/chat"
            element={<ProtectedRoute><VcsFrontpage mode="chat" /></ProtectedRoute>}
          />
          <Route path="/vc" element={<Navigate to="/vc/frontpage/3d" replace />} />
          <Route path="/vc/sim" element={<ProtectedRoute><Vcs /></ProtectedRoute>} />

          {/* ─── CUSTOMER SERVICE ────────────────────────────────── */}
          {/* localhost:3000/customer/frontpage/3d   */}
          {/* localhost:3000/customer/frontpage/chat */}
          <Route
            path="/customer/frontpage/3d"
            element={<ProtectedRoute><CustomerFrontpage mode="3d" /></ProtectedRoute>}
          />
          <Route
            path="/customer/frontpage/chat"
            element={<ProtectedRoute><CustomerFrontpage mode="chat" /></ProtectedRoute>}
          />
          <Route path="/customer" element={<Navigate to="/customer/frontpage/3d" replace />} />
          <Route path="/customer/sim" element={<ProtectedRoute><Customer /></ProtectedRoute>} />

          {/* ─── CEO COACH ───────────────────────────────────────── */}
          {/* localhost:3000/ceo/frontpage/3d   */}
          {/* localhost:3000/ceo/frontpage/chat */}
          <Route
            path="/ceo/frontpage/3d"
            element={<ProtectedRoute><CeoCoachFrontpage mode="3d" /></ProtectedRoute>}
          />
          <Route
            path="/ceo/frontpage/chat"
            element={<ProtectedRoute><CeoCoachFrontpage mode="chat" /></ProtectedRoute>}
          />
          <Route path="/ceo" element={<Navigate to="/ceo/frontpage/3d" replace />} />
          <Route path="/ceo/sim" element={<ProtectedRoute><CeoCoach /></ProtectedRoute>} />

          {/* ─── CATCH ALL ───────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;