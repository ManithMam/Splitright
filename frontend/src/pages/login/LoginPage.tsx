import React, { useState } from "react";
import "./LoginPage.css";
import { Alert, Button, Snackbar, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {login} from "../../logic/auth-service";

const LoginPage: React.FC<{ setIsLoggendIn: (isLoggendIn: boolean) => void }> = ({ setIsLoggendIn }) => {

	const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLogin = async () => {

    setUsernameError(false);
    setPasswordError(false);

    if (username === '') {
      setUsernameError(true)
    }
    if (password === '') {
      setPasswordError(true)
    }

    if (username && password) {
      const isLoggedIn = await login(username,password);
      setIsLoggendIn(isLoggedIn);

      if(isLoggedIn) {
        navigate("/home");
      }
      else {
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <div className="LoginContainer">
      <img src={process.env.PUBLIC_URL + '/splitRightLogo.png'} className="Img" />
      <div className="InputArea">

        <TextField 
          label="Username" 
          value={username}
          variant="outlined" 
          onChange={e => setUsername(e.target.value)}
          error={usernameError} 
          helperText={usernameError && 'Username cannot be empty'}
          // Maybe another color than var(--primary-color-light) would be more appropriate
          InputProps={{
            style: {
              color: 'var(--primary-color-light)'
            },
            placeholder: 'Username',
          }}
          InputLabelProps={{
            style: {
              color: 'var(--primary-color-light)',
            },
          }}
        />
        
        <TextField 
          type="password"
          label="Password"
          value={password} 
          variant="outlined" 
          onChange={e => setPassword(e.target.value)}
          error={passwordError} 
          helperText={passwordError && 'Password cannot be empty'}
          // Maybe another color than var(--primary-color-light) would be more appropriate
          InputProps={{
            style: {
              color: 'var(--primary-color-light)'
            },
            placeholder: 'Password',
          }}
          InputLabelProps={{
            style: {
              color: 'var(--primary-color-light)',
            },
          }}
        />

        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="error" className="ErrorText">
              "Wrong username or password"
            </Alert>
        </Snackbar>

        <Button variant="contained" onClick={handleLogin} className='MainBtn'>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;