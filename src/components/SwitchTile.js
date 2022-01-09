import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Avatar,
  Stack,
  CardContent,
  Switch,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { grey, pink } from "@mui/material/colors";

const SwitchTile = ({ title, output }) => {
  // Avatar basical style:
  const basicStyle = { bgcolor: grey[800], width: 54, height: 54 };
  // State
  const [check, setCheck] = useState(false);
  const [style, setStyle] = useState(basicStyle);
  // Option core to display:
  const toggle = (
    <Switch
      color="default"
      onChange={() => {
        setCheck((prevCheck) => !prevCheck);
      }}
    />
  );
  // Color change when radio btn checked
  useEffect(() => {
    if (check !== false) {
      setStyle({ bgcolor: pink[300], width: 54, height: 54 });
      output(check);
    } else {
      setStyle({ bgcolor: grey[800], width: 54, height: 54 });
      output(check);
    }
  }, [check, output]);
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
              <FavoriteIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="dark" align="center">
              {title}
            </Typography>
          </Stack>
        </CardContent>
        <CardContent>{toggle}</CardContent>
      </Stack>
    </Card>
  );
};

export default SwitchTile;
