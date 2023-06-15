import React from 'react';
import {Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import GameResults from './components/gameResults/GameResults';
import HomePage from './components/home/HomePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import LoginPage from './components/login/LoginPage';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LobbyPage from './components/lobby/LobbyPage';
import PrevGamesPage from './components/prevGames/PrevGamesWindow';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ECFFFF',
      main: '#4AAEF0',
      dark: '#18374D',
    },
    secondary: {
      light: '#E6D1FB',
      main: '#B474F4',
      dark: '#59288A',
    },
    error: {
      light: '#FBD1D2',
      main: '#F47477',
      dark: '#F0464A',
    },
    success: {
      light: '#D5F7DE',
      main: '#57DE7A',
      dark: '#3C9955',
    },
    contrastThreshold: 10,
    tonalOffset: 0.2,
  },
});

interface ProtectedRouteProps {
  accountId: string | null;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ accountId, redirectPath = '/login' }) => {
  if (!accountId) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  const [accountId, setAccountId] = React.useState<string | null>(null);

  const handleLogout = () => {
    setAccountId(null)
  }

  return (
      <ThemeProvider theme={theme}>
        <div className='App'>

          {accountId && ( // Render only if user is not null
            <div className='Logout'>
              <Button onClick={handleLogout} component={Link} to="/login" endIcon={<LogoutIcon />}>
                Logout
              </Button>
            </div>
          )}

          <div className='AppContent'>
            <Routes>
              <Route element={<ProtectedRoute accountId={accountId} />} >
                <Route path="/home" element={<HomePage/>} />
                <Route path="/previousGames" element={<PrevGamesPage/>} />
                <Route path="/gameResults" element={<GameResults/>} />
                <Route path="/lobby" element={<LobbyPage/>} />
              </Route>
              <Route index element={<LoginPage setAccountId={setAccountId} />} />
              <Route path="/login" element={<LoginPage setAccountId={setAccountId} />} />
              <Route path="*" element={<p>There's nothing here: 404!</p>} />              
            </Routes>
          </div>
          
        </div>
      </ThemeProvider>    
  );
};

export default App;