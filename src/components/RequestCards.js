import React from "react";
import { Typography, CardContent } from "@mui/material";

const RequestCards = ({ title, text, color }) => {
  return (
    <CardContent sx={{ mb: 1, bgcolor: color }}>
      <Typography gutterBottom variant="h5" component="div" align="center">
        {title}
      </Typography>
      <Typography variant="body2" align="center">
        {text}
      </Typography>
    </CardContent>
  );
};

export default RequestCards;
