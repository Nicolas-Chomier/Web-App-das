import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { grey, green } from "@mui/material/colors";

const TitleSection = ({ title, output }) => {
  const textFieldRef = useRef("");
  // Avatar basical style:
  const basicStyle = { bgcolor: grey[800], width: 54, height: 54 };
  // State
  const [ref, setRef] = useState(false);
  const [style, setStyle] = useState(basicStyle);
  // Option core to display:
  const text = (
    <TextField
      inputRef={textFieldRef}
      inputProps={{ maxLength: 20 }}
      type="text"
      label="Project title here!"
      variant="outlined"
      onChange={() => {
        setRef(textFieldRef.current?.value);
      }}
    />
  );
  // Color change when radio btn checked
  useEffect(() => {
    if (textFieldRef.current?.value !== "") {
      setStyle({ bgcolor: green[500], width: 54, height: 54 });
      output(ref);
    } else {
      setStyle({ bgcolor: grey[800], width: 54, height: 54 });
    }
  }, [ref, output]);
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
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="dark" align="center">
              {title}
            </Typography>
          </Stack>
        </CardContent>
        <CardContent>{text}</CardContent>
      </Stack>
    </Card>
  );
};

export default TitleSection;
