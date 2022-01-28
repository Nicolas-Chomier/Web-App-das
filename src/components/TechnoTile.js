import React, { useState, useEffect } from "react";
import { Card, Typography, Avatar, Stack, CardContent } from "@mui/material";
import SelectCustom from "./SelectCustom";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { grey, green } from "@mui/material/colors";

const TechnoTile = ({ title, datas, output }) => {
  const data = datas.IHM_PROFACE.data;
  // Avatar basical style:
  const basicStyle = { bgcolor: grey[800], width: 54, height: 54 };
  // State
  const [result, setResult] = useState(false);
  const [style, setStyle] = useState(basicStyle);
  // Option core to display:
  const select = <SelectCustom data={data} output={setResult} />;
  // Color change when radio btn checked
  useEffect(() => {
    if (result !== false) {
      setStyle({ bgcolor: green[500], width: 54, height: 54 });
      output(result);
    }
  }, [result, output]);
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
              <AddToQueueIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="dark" align="center">
              {title}
            </Typography>
          </Stack>
        </CardContent>
        <CardContent>{select}</CardContent>
      </Stack>
    </Card>
  );
};

export default TechnoTile;
