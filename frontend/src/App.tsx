import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import BruteCreation from './components/BruteCreation';
import BruteDetails from './components/BruteDetails';
import BruteDetailsWrapper from './components/BruteDetailsWrapper';
import Home from './components/Home';
import Header from './components/Header';
import OpponentSelection from './components/OpponentSelection';
import BattleScreen from './components/BattleScreen';
import { authService, bruteService } from './services/api';

// Función para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Tema personalizado
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
  },
});

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <Header />
      {children}
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/create-brute"
            element={
              <ProtectedLayout>
                <BruteCreation />
              </ProtectedLayout>
            }
          />
          <Route
            path="/brutes/:bruteId"
            element={
              <ProtectedLayout>
                <BruteDetailsWrapper />
              </ProtectedLayout>
            }
          />
          <Route
            path="/opponents"
            element={
              <ProtectedLayout>
                <OpponentSelection />
              </ProtectedLayout>
            }
          />
          <Route
            path="/battle"
            element={
              <ProtectedLayout>
                <BattleScreen />
              </ProtectedLayout>
            }
          />
          <Route
            path="/"
            element={
              authService.isAuthenticated() ? (
                <Navigate to="/opponents" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
