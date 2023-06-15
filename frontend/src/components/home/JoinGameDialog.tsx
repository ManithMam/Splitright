import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, TextField } from '@mui/material';
import './CreateGameDialog.css';
import { useState } from 'react';

export default function JoinGameDialog() {
  const [open, setOpen] = React.useState(false);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false)


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setCodeError(false)

    if (code === '') {
      setCodeError(true)
    }
    else if (code.length !== 7) {
      setCodeError(true)
    }

    if (code && code.length === 7) {
      console.log(code)
    }
  }

  return (
    <div>
      <Button className='ImportantBtn Btn' variant="contained" onClick={handleClickOpen}>
        Join
      </Button>

      <Dialog open={open} onClose={handleClose}>

        <DialogTitle className='DialogTitle' sx={{ textAlign: 'center' }}>Join Split</DialogTitle>

        <DialogContent className='DialogContent'>

          <TextField 
            className='Dialog-Item' 
            label="Amount" 
            variant="outlined" 
            onChange={e => setCode(e.target.value)}
            error={codeError} 
            helperText={codeError ? 'Code must be 7 digits' : ''}
          />
          
          <div className='Dialog-Item ButtonGroup'>
            <Button variant="outlined" onClick={handleClose} className='SecondaryBtn Btn'>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} className='ImportantBtn Btn'>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}