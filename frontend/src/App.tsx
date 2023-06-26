import React from 'react';
import {Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import LoginPage from './pages/login/LoginPage';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LobbyPage from './pages/lobby/LobbyAdmin';
import PrevGamesPage from './pages/prevGames/PrevGamesPage';
import GameResultsPage from './pages/gameResults/GameResultsPage';
import LobbyGuest from './pages/lobby/LobbyGuest';

const theme = createTheme({
  palette: {
    primary: {
      light: "#ECFFFF",
      main: "#4AAEF0",
      dark: "#18374D",
    },
    secondary: {
      light: "#E6D1FB",
      main: "#B474F4",
      dark: "#59288A",
    },
    error: {
      light: '#FBD1D2',
      main: '#F47477',
      dark: '#b80013',
    },
    success: {
      light: "#D5F7DE",
      main: "#57DE7A",
      dark: "#3C9955",
    },
    contrastThreshold: 10,
    tonalOffset: 0.2,
  },
});

interface ProtectedRouteProps {
  isLoggendIn: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggendIn, redirectPath = '/login' }) => {
  if (!isLoggendIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  const [isLoggendIn, setIsLoggendIn] = React.useState<boolean>(false);

  const handleLogout = () => {
    setIsLoggendIn(false)
  }

  return (
      <ThemeProvider theme={theme}>
        <div className='App'>

          {isLoggendIn && ( // Render only if user is not null
            <div className='Logout'>
              <Button onClick={handleLogout} component={Link} to="/login" endIcon={<LogoutIcon />}>
                Logout
              </Button>
            </div>
          )}

          <div className='AppContent'>
            <Routes>
              <Route element={<ProtectedRoute isLoggendIn={isLoggendIn} />} >
                <Route path="/home" element={<HomePage/>} />
                <Route path="/previousGames" element={<PrevGamesPage/>} />
                <Route path="/gameResults/:id" element={<GameResultsPage/>} />
                <Route path="/lobbyAdmin/:lobbyId" element={<LobbyPage/>} />
                <Route path="/lobbyGuest/:id" element={<LobbyGuest/>} />
              </Route>
              <Route index element={<LoginPage setIsLoggendIn={setIsLoggendIn} />} />
              <Route path="/login" element={<LoginPage setIsLoggendIn={setIsLoggendIn} />} />
              <Route path="*" element={<p>There's nothing here: 404!</p>} />              
            </Routes>
          </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
