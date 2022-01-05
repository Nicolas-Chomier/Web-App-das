import React from "react";
import { Typography } from "@mui/material";

const TitleCustom = ({ title, color }) => {
  const styles = { mt: 0, color: color };
  return (
    <Typography sx={styles} variant="h5" component="div">
      {title}
    </Typography>
  );
};

export default TitleCustom;
