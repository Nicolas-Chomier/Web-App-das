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
//import ImageCustom from "./ImageCustom";

const ElementPanel = ({ data, config, output }) => {
  console.log("efsefesfefsefse", data);
  // Datas distribution (From JSON):
  const title = data.title;
  console.log(title);
  //const image = data.image;
  const datas = data.data;
  const noTag = data.default_tag;
  const color = data.color;
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
    <Card sx={{ width: "100%", mx: "1vw" }}>
      {/* CARD TITLE */}
      <CardActions sx={{ mt: 1, justifyContent: "center" }}>
        <Typography variant="h5" color={color} align="center">
          {title}
        </Typography>
      </CardActions>
      {/* CARD IMAGE 
      <CardActions sx={{ justifyContent: "center" }}>
        <ImageCustom image={image} />
      </CardActions>*/}
      {/* CARD SELECTION */}
      <CardActions sx={{ justifyContent: "center" }}>
        <SelectCustom data={datas} output={setSelecion} />
      </CardActions>
      {/* CARD TEXTFIELD */}
      <CardActions sx={{ justifyContent: "center" }}>
        <Stack spacing={2}>
          <Typography variant="h6" color={color} align="center">
            {"Tag (PID)"}
          </Typography>
          <TextField
            sx={{ m: 1, width: "15em" }}
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
          <Typography variant="h6" color={color} align="center">
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
        <Button
          sx={{ bgcolor: color }}
          variant="contained"
          onClick={handleClick}
        >
          Ajouter +1
        </Button>
      </CardActions>
    </Card>
  );
};

export default ElementPanel;
