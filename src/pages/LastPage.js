import React from "react";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  return (
    <div>
      <Button
        /* sx={{ bgcolor: "blue" }} */
        size="large"
        variant="contained"
        onClick={() => {
          console.log(location);
        }}
        color="info"
      >
        Send
      </Button>
    </div>
  );
};

export default LastPage;
