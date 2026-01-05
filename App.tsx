import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PoliticsTest from './pages/PoliticsTest';
import RegionalData from './pages/RegionalData';
import Participate from './pages/Participate';
import AgendaDetail from './pages/AgendaDetail';
import NewPolitician from './pages/NewPolitician';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes with Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/test" element={<PoliticsTest />} />
                  <Route path="/regional-data" element={<RegionalData />} />
                  <Route path="/participate" element={<Participate />} />
                  <Route path="/participate/:id" element={<AgendaDetail />} />
                  <Route path="/new-politician" element={<NewPolitician />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;