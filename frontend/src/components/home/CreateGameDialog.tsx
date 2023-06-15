import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { DialogContent, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import './CreateGameDialog.css';
import { Info } from '@mui/icons-material';
import { useState } from 'react';

interface ModeToggleButtonProps {
  mode: string;
  onChange: (newMode: string) => void;
}

function ModeToggleButton({ mode, onChange }: ModeToggleButtonProps) {
    const [modeInfo, setModeInfo] = React.useState('Each member must equally pay towards the tab.');
  
    const handleChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
      onChange(newMode); // Notify parent component about the mode change
      if (newMode === 'communist') {
        setModeInfo('Each member must equally pay towards the tab.');
      } else if (newMode === 'random') {
        setModeInfo('Each member is given a random amount to pay towards the tab.');
      } else {
        setModeInfo('One lucky member gets to cover the whole tab.');
      }
    };
  
    return (
        <div className='Dialog-Item'>
            <ToggleButtonGroup value={mode} exclusive onChange={handleChange} className='ToggleBtnGroup'>
                <ToggleButton color="error" value="communist" className='ToggleBtn'>Communist</ToggleButton>
                <ToggleButton color="secondary" value="random" className='ToggleBtn'>Random</ToggleButton>
                <ToggleButton color="success" value="lucky" className='ToggleBtn'>Lucky One</ToggleButton>
            </ToggleButtonGroup>
            <div className='Toggle-Btn-Info-Group'><Info></Info> <Typography>{modeInfo}</Typography></div>
        </div>
    );
}


export default function CreateGameDialog() {
  const [open, setOpen] = React.useState(false);

  const [mode, setMode] = React.useState('communist');

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

  const handleSubmit = (event: any) => {
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
      console.log(title, amount, mode)
    }
  }

  return (
    <div>
      <Button className='ImportantBtn Btn' variant="contained" onClick={handleClickOpen}>
        Create
      </Button>

      <Dialog open={open} onClose={handleClose}>

        <DialogTitle className='DialogTitle' sx={{ textAlign: 'center' }}>Create Split</DialogTitle>

        <DialogContent className='DialogContent'>

          <TextField 
            className='Dialog-Item TopItem' 
            label="Title" 
            variant="outlined"
            onChange={e => setTitle(e.target.value)} 
            error={titleError}
            helperText={titleError && 'Title cannot be empty'}
          />

          <ModeToggleButton mode={mode} onChange={handleModeChange} />

          <TextField 
            className='Dialog-Item' 
            label="Amount" 
            variant="outlined" 
            onChange={e => setAmount(e.target.value)}
            error={amountError} 
            helperText={amountError ? 'Amount must be a number' : ''}
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