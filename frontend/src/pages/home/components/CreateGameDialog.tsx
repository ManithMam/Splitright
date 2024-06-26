import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, TextField } from '@mui/material';
import './Dialog.css';
import '../../../App.css';
import { useState } from 'react';
import {createGame} from "../../../logic/game-service";
import { useNavigate } from 'react-router-dom';
import ModeToggleButton from './ModeToggleButton';

export default function CreateGameDialog() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const [mode, setMode] = React.useState('Communist');

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false)

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleModeChange = (newMode: any) => {
    setMode(newMode);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setTitleError(false)
    setAmountError(false)

    if (title === '') {
      setTitleError(true)
    }

    if (amount === '') {
      setAmountError(true)
    }
    else if (isNaN(Number(amount))) {
      setAmountError(true)
    }

    if (title && amount && !isNaN(Number(amount))) {

      const gameId: string = await createGame({
        title: title,
        mode: mode,
        amount: Number(amount),
      })
      if(gameId) {
        navigate("/lobbyAdmin/" + gameId);
      }
    }
  }

  return (
    <div>
      <Button className="MainBtn" onClick={handleClickOpen}>
        Create
      </Button>

      <Dialog open={open} onClose={handleClose}>

        <DialogTitle className='DialogTitle'>Create Split</DialogTitle>

        <DialogContent className='DialogContent'>

          <TextField 
            className='Dialog-Item TopItem' 
            label="Title" 
            variant="outlined"
            onChange={e => setTitle(e.target.value)} 
            error={titleError}
            helperText={titleError && 'Title cannot be empty'}
          />

          <ModeToggleButton mode={mode} onChange={handleModeChange}/>

          <TextField 
            className='Dialog-Item' 
            label="Amount" 
            variant="outlined" 
            onChange={e => setAmount(e.target.value)}
            error={amountError} 
            helperText={amountError ? 'Amount must be a number' : ''}
          />
          
          <div className='Dialog-Item DialogButtonGroup'>
            <Button variant="outlined" onClick={handleClose} className='SecondaryBtn'>Cancel</Button>
            <Button onClick={handleSubmit} className='MainBtn'>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}