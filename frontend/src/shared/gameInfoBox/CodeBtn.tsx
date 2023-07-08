import { Button, Snackbar, SnackbarContent } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from "react";
import "./CodeBtn.css";

interface CodeBtnProps {
    code: string | undefined;
}

const CodeBtn: React.FC<CodeBtnProps> = ({ code }) => {

const [open, setOpen] = React.useState(false);

  const copyToClipboard = () => {
    if(code) {
        navigator.clipboard.writeText(code)
        .catch((error) => {
            console.error('Failed to copy value to clipboard:', error);
        });

        setOpen(true)
    }
  };

  if (!code) {
    return null; // Render nothing if code is undefined
  }

  const elementId = "button-copy";

  return (
    <div>
      <Button
        id={elementId}
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={copyToClipboard}
      >
        {code}
      </Button>
  
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent className="snackbar-content" message="Code copied to clipboard" />
      </Snackbar>
    </div>
  );
  
     
};
export default CodeBtn;
