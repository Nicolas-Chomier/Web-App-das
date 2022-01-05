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
    <Card sx={{ maxWidth: 350 }}>
      <CardActions sx={{ justifyContent: "center" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Avatar variant="rounded" sx={{ bgcolor: grey[700] }}>
            <AssignmentIcon />
          </Avatar>
          <Typography variant="h5" color="primary">
            Nom du projet
          </Typography>
        </Stack>
      </CardActions>
      <CardActions sx={{ mb: 2, justifyContent: "center" }}>
        <TextField
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
      </CardActions>
    </Card>
  );
};

export default TitleSection;
