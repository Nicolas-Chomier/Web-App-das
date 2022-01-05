import React from "react";
import { Card, CardActions, Typography, Avatar, Stack } from "@mui/material";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TabletIcon from "@mui/icons-material/Tablet";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { blue, teal, green, red } from "@mui/material/colors";

const StatusSection = ({ status1, status2, status3, status4 }) => {
  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardActions sx={{ justifyContent: "center" }}>
        <Typography variant="h5" color="primary" align="center">
          Statut
        </Typography>
      </CardActions>

      <CardActions sx={{ mb: 2, justifyContent: "center" }}>
        <Stack direction="row" spacing={2}>
          <Avatar
            variant="rounded"
            sx={
              status1 !== "" ? { bgcolor: green[500] } : { bgcolor: red[400] }
            }
          >
            <AssignmentIcon />
          </Avatar>
          <Avatar
            variant="rounded"
            sx={
              status2 !== false
                ? { bgcolor: green[500] }
                : { bgcolor: red[400] }
            }
          >
            <TabletIcon />
          </Avatar>
          <Avatar
            variant="rounded"
            sx={
              status3 !== false
                ? { bgcolor: green[500] }
                : { bgcolor: red[400] }
            }
          >
            <AddToQueueIcon />
          </Avatar>
          <Avatar
            variant="rounded"
            sx={
              status4 !== false
                ? { bgcolor: teal[500] }
                : { bgcolor: blue[400] }
            }
          >
            <DeviceHubIcon />
          </Avatar>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default StatusSection;
