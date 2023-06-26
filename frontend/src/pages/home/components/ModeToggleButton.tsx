import { Info } from "@mui/icons-material";
import { ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import React from "react";

interface ModeToggleButtonProps {
    mode: string;
    onChange: (newMode: string) => void;
}
  
function ModeToggleButton({ mode, onChange }: ModeToggleButtonProps) {
    const [modeInfo, setModeInfo] = React.useState('Each member must equally pay towards the tab.');

    const handleChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
        onChange(newMode); // Notify parent component about the mode change
        if (newMode === 'Communist') {
            setModeInfo('Each member must equally pay towards the tab.');
        } else if (newMode === 'Random') {
            setModeInfo('Each member is given a random amount to pay towards the tab.');
        } else {
            setModeInfo('One lucky member gets to cover the whole tab.');
        }
    };

    return (
        <div className='Dialog-Item'>
            <ToggleButtonGroup value={mode} exclusive onChange={handleChange} className='ToggleBtnGroup'>
                <ToggleButton color="error" value="Communist" className='ToggleBtn'>Communist</ToggleButton>
                <ToggleButton color="secondary" value="Random" className='ToggleBtn'>Random</ToggleButton>
                <ToggleButton color="success" value="Lucky" className='ToggleBtn'>Lucky One</ToggleButton>
            </ToggleButtonGroup>
            <div className='Toggle-Btn-Info-Group'><Info></Info> <Typography>{modeInfo}</Typography></div>
        </div>
    );
}

export default ModeToggleButton;