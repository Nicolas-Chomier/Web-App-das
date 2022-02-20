import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Avatar,
  Stack,
  CardContent,
  Box,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import Slider from "@mui/material/Slider";
import { amber } from "@mui/material/colors";

const CoefTile = ({ title, output }) => {
  // Avatar basical style:
  const [color, setColor] = useState(1.2);
  const [style, setStyle] = useState({});

  // Slider value changement
  const handleChange = (event, newValue) => {
    setColor(newValue);
    output(newValue);
  };
  // Option core to display:
  const slider = (
    <Box width={190}>
      <Slider
        color="primary"
        defaultValue={1.2}
        aria-label="Default"
        size="medium"
        valueLabelDisplay="auto"
        step={0.1}
        min={1}
        max={1.8}
        onChange={handleChange}
      />
    </Box>
  );
  // Color change according to the slider stroke
  useEffect(() => {
    let colorIndex = Math.round((color - 1) * 1000 + 100);
    setStyle({ bgcolor: amber[colorIndex], width: 54, height: 54 });
  }, [color]);
  // //

  return (
    <Card sx={{ width: "100%", mx: "1vw", my: "1vh" }} elevation={5}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0}
      >
        <CardContent sx={{ mt: 1 }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Avatar variant="rounded" sx={style}>
              <ScienceIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="dark" align="center">
              {title}
            </Typography>
          </Stack>
        </CardContent>
        <CardContent className="slider-tile">{slider}</CardContent>
      </Stack>
    </Card>
  );
};

export default CoefTile;
