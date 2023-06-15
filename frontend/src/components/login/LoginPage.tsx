import React, { useState } from "react";
import "./LoginPage.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC<{ setAccountId: (accountId: string | null) => void }> = ({ setAccountId }) => {

	const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = () => {

    setUsernameError(false);
    setPasswordError(false);

    if (username === '') {
      setUsernameError(true)
    }
    if (password === '') {
      setPasswordError(true)
    }

    if (username && password) {
      console.log(username, password)
      const accountId = "123";
      setAccountId(accountId);
      navigate("/home");

      /*fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        // change later
        const accountId = data.accountId;
        setAccountId(accountId); // Set the accountId in the App component
      })
      .catch(error => {
        // Handle any errors
        console.error('Login error:', error);
      });*/
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
        />
        
        <TextField 
          type="password"
          label="Password"
          value={password} 
          variant="outlined" 
          onChange={e => setPassword(e.target.value)}
          error={passwordError} 
          helperText={passwordError && 'Password cannot be empty'}
        />

        <Button variant="contained" onClick={handleLogin} className='ImportantBtn Btn'>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;