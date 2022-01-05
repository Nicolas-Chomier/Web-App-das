import React, { useState, useRef } from "react";
import {
  Card,
  CardActions,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import SelectCustom from "./SelectCustom";
import RadioCustom from "./RadioCustom";
import ImageCustom from "./ImageCustom";

const ElementPanel = ({ data, config, output }) => {
  // Datas distribution (From JSON):
  const title = data.title;
  const image = data.image;
  const datas = data.data;
  const noTag = data.default_tag;
  const radio = config.Option;

  // Return from composant:
  const [selection, setSelecion] = useState(false);
  const textRef = useRef("");
  const [radios, setRadios] = useState(0);

  // Validation datas function to create a object carrying results
  function handleClick() {
    //console.log(selection, textRef, radios);
    if (selection !== false && radios !== 0) {
      output({
        title: title,
        id: selection["id"],
        name: selection["generic name"],
        tag: `${textRef.current?.value}`,
        group: radios,
      });
    } else {
      alert("Select component and/or fill group !");
    }
  }

  // MAIN //
  return (
    <Card sx={{ maxWidth: 280 }}>
      {/* CARD TITLE */}
      <CardActions sx={{ mt: 1, justifyContent: "center" }}>
        <Typography variant="h5" color="primary" align="center">
          {title}
        </Typography>
      </CardActions>
      {/* CARD IMAGE */}
      <CardActions sx={{ justifyContent: "center" }}>
        <ImageCustom image={image} />
      </CardActions>
      {/* CARD SELECTION */}
      <CardActions sx={{ justifyContent: "center" }}>
        <SelectCustom data={datas} output={setSelecion} />
      </CardActions>
      {/* CARD TEXTFIELD */}
      <CardActions sx={{ justifyContent: "center" }}>
        <Stack spacing={2}>
          <Typography variant="h5" color="primary" align="center">
            {"Tag (PID)"}
          </Typography>
          <TextField
            inputRef={textRef}
            inputProps={{ maxLength: 20 }}
            defaultValue={noTag}
            type="text"
            label="Fill tag here !"
            variant="outlined"
          />
        </Stack>
      </CardActions>
      {/* CARD RADIO */}
      <CardActions sx={{ justifyContent: "center" }}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="h5" color="primary" align="center">
            Choix du groupe
          </Typography>
          <RadioCustom
            qty={radio}
            state={false}
            label={"G"}
            output={setRadios}
          />
        </Stack>
      </CardActions>
      {/* CARD BUTTON */}
      <CardActions sx={{ mb: 1, justifyContent: "center" }}>
        <Button variant="contained" onClick={handleClick}>
          Ajouter +1
        </Button>
      </CardActions>
    </Card>
  );
};

export default ElementPanel;
