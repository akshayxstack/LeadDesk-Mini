import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  // Token stored in React state ONLY (memory-only token storage)
  const [token, setToken] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* / — Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* /admin/login — Standalone admin login page */}
        <Route
          path="/admin/login"
          element={<AdminLogin onLoginSuccess={(newToken) => setToken(newToken)} />}
        />

        {/* /admin — Protected leads dashboard */}
        <Route
          path="/admin"
          element={
            token ? (
              <AdminDashboard token={token} onLogout={() => setToken(null)} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
