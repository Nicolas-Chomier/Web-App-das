import React, { useState, useEffect } from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";

const RadioCustom = ({
  qty,
  state,
  label = false,
  position = "start",
  output,
}) => {
  const [radioList, setRadioList] = useState([]);
  const [displayedLabel, setDisplayedLabel] = useState("");
  // Logic & config for radio buttons elements:
  useEffect(() => {
    if (label) {
      setDisplayedLabel(`${label}`);
    }
    if (state !== true) {
      const radioBtnList = [];
      // For loop wich building radio button
      for (let i = 1; i < qty + 1; i++) {
        radioBtnList.push(
          <FormControlLabel
            disabled={state}
            key={`rn°${i}`}
            control={<Radio size="small" />}
            value={i}
            label={`${displayedLabel}${i}`}
            labelPlacement={position}
            onChange={() => {
              output(i);
            }}
          />
        );
      }
      setRadioList(radioBtnList);
    } else {
      setRadioList([]);
    }
  }, [output, state, qty, displayedLabel, position, label]);

  return (
    <FormControl component="fieldset">
      <RadioGroup
        sx={{
          display: "flex",
          mb: 1,
          alignItems: "center",
          overflow: "hidden",
        }}
        row
        aria-label="radio"
        name="row-radio-buttons-group"
      >
        {radioList}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioCustom;
