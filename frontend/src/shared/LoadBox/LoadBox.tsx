import React from 'react';
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import "./LoadBox.css";

const LoadBox = () => {
  return (
    <Box className="LoadBox"> <CircularProgress /> </Box>
  );
};

export default LoadBox;
