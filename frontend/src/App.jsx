import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import Stats from './pages/Stats';
import StudentDashboard from './pages/StudentDashboard';
import NotAuthorized from './pages/NotAuthorized';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username && role) {
      setUser({ username, role });
    }
  }, []);

  const handleLogin = (payload) => {
    setUser(null);
    setTimeout(() => {
      setUser(payload);
    }, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return user.role === 'student' ? (
        <Navigate to="/student" />
      ) : (
        <Navigate to="/not-authorized" />
      );
    }
    return children;
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                user.role === 'teacher' ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                user.role === 'teacher' ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Register onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.role === 'teacher' ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/student" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Dashboard enseignant */}
          <Route
            path="/quiz/create"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Dashboard key={user?.username} />
              </ProtectedRoute>
            }
          />

          {/* Dashboard étudiant */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard key={user?.username} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:attemptId"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Stats key={user?.username} />
              </ProtectedRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;