import React, { useRef } from "react";
import {
  Card,
  CardActions,
  TextField,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { grey } from "@mui/material/colors";

const TitleSection = ({ output }) => {
  const textFieldRef = useRef(false);

  return (
    <Card elevation={5}>
      <CardActions sx={{ justifyContent: "center" }}>
        <Typography variant="h5" color="dark">
          Nom du projet
        </Typography>
      </CardActions>
      <CardActions sx={{ mb: 2, justifyContent: "center" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Avatar
            variant="rounded"
            sx={{ width: 54, height: 54, bgcolor: grey[800] }}
          >
            <AssignmentIcon fontSize="large" />
          </Avatar>
          <TextField
            color="success"
            inputRef={textFieldRef}
            inputProps={{ maxLength: 20 }}
            /* defaultValue={"New Project"} */
            type="text"
            label="Project title here!"
            variant="outlined"
            onChange={() => {
              output(textFieldRef.current?.value);
            }}
          />
        </Stack>
      </CardActions>
    </Card>
  );
};

export default TitleSection;
