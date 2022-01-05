import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  Typography,
  Avatar,
  Stack,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import RadioCustom from "./RadioCustom";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { grey } from "@mui/material/colors";

const OptionSection = ({ output, output2 }) => {
  const btnNumber = 4;
  const [check, setCheck] = useState(false);
  const [display, setDisplay] = useState("");

  // refresh when toggle btn switch status
  useEffect(() => {
    if (check) {
      setDisplay(
        <RadioCustom
          qty={btnNumber}
          state={!check}
          /* label={} */
          output={output}
          position={"top"}
        />
      );
    } else {
      output(false);
      setDisplay("");
    }
  }, [check, output]);

  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardActions sx={{ justifyContent: "center" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Avatar variant="rounded" sx={{ bgcolor: grey[700] }}>
            <AddToQueueIcon />
          </Avatar>
          <Typography variant="h5" color="primary" align="center">
            Options
          </Typography>
        </Stack>
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch
                onChange={() => {
                  setCheck((prevCheck) => !prevCheck);
                }}
              />
            }
            label="Nombre d'IHM"
          />
        </FormGroup>
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>{display}</CardActions>
      <CardActions sx={{ mb: 1, justifyContent: "center" }}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch
                onChange={() => {
                  output2((prevCheck) => !prevCheck);
                }}
              />
            }
            label="Architecture Open-Air"
          />
        </FormGroup>
      </CardActions>
    </Card>
  );
};

export default OptionSection;
