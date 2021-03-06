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
import SelectCustom from "./SelectCustom";
import TabletIcon from "@mui/icons-material/Tablet";
import { grey } from "@mui/material/colors";

////////////////////////////
// to keep for futur
////////////////////////////
const TechnoSection = ({ datas, output }) => {
  const [state1, setState1] = useState(false);
  // (WAGO is deactived)
  //const [state2, setState2] = useState(false);
  const [display1, setDisplay1] = useState("");
  const [display2, setDisplay2] = useState("");

  function handleChange() {
    // Change state of toggle switch (WAGO is deactived)
    console.log("type1");
    setState1(!state1);
    // (WAGO is deactived)
    /* setState2(!state2); */
  }

  useEffect(() => {
    const data = datas.IHM_PROFACE.data;
    const sd1 = <SelectCustom data={data} output={output} />;
    // (WAGO is deactived)
    /* const data2 = datas["WAGO"]["data"];
    const sd2 = <SelectCustom data={data2} output={output} />; */
    if (state1) {
      setDisplay1(sd1);
      setDisplay2("");
      output(false);
    } else {
      setDisplay1("");
      setDisplay2("");
      // (WAGO is deactived)
      /* setDisplay2(sd2); */
      output(false);
    }
  }, [state1 /* state2 */, datas, output]);

  return (
    <Card className="techno-section" sx={{ bgcolor: grey[100] }} elevation={5}>
      <CardActions sx={{ mt: 2, justifyContent: "center" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Avatar
            variant="rounded"
            sx={{ bgcolor: grey[800], width: 54, height: 54 }}
          >
            <TabletIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" color="dark" align="center">
            Technologie
          </Typography>
        </Stack>
      </CardActions>

      <CardActions sx={{ justifyContent: "center" }}>
        <FormGroup>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch color="success" checked={state1} onClick={handleChange} />
            }
            label="PROFACE"
          />
        </FormGroup>
      </CardActions>

      <CardActions sx={{ justifyContent: "center" }}>{display1}</CardActions>

      <CardActions sx={{ justifyContent: "center" }}>
        <FormGroup>
          <FormControlLabel
            disabled
            labelPlacement="top"
            control={
              <Switch
                color="success"
                /* checked={state2} */ onClick={handleChange}
              />
            }
            label="WAGO"
          />
        </FormGroup>
      </CardActions>

      <CardActions sx={{ justifyContent: "center" }}>{display2}</CardActions>
    </Card>
  );
};

export default TechnoSection;
