import React, { useState, useRef, useEffect } from "react";
import { Card, CardActions, TextField, Button } from "@mui/material";
import SelectCustom from "./SelectCustom";
import RadioCustom from "./RadioCustom";
import TitleCustom from "./TitleCustom";
import ImageCustom from "./ImageCustom";

const ElementPanel = ({ data, config, output }) => {
  const [selectResult, setSelectResult] = useState(false);
  const [radioResult, setRadioResult] = useState(0);
  // Get value to text fiel component
  const textFieldRef = useRef(false);
  // DataA => data from json, dataB => data from projectPanel component
  const componentImage = `images/${data["images"]}`;
  const componentTitle = data["title"];
  const componentData = data["data"];
  const componentTag = data["default_tag"];
  const componentColor = data["color"];
  const componentRadioNbs = config["Option"];
  const componentLabel = "Groupe N°";
  const componentToggle = config["openAir"];
  // Refresh the data provided by the project panel from the parent
  useEffect(() => {
    //console.log("<<vsdvds<<<", componentRadioNbs);
    setRadioResult(1);
  }, [config, componentRadioNbs]);
  //
  useEffect(() => {}, [radioResult]);
  // Logic & config for validation button element:
  const handleClickA = () => {
    //console.log("handleClick");
    if (componentToggle === false) {
      //console.log("componentToggle", componentToggle);
      setRadioResult(1);
      //console.log("radioResult", radioResult);
      if (selectResult === false) {
        //console.log("<<<<", radioResult);
        alert("Please choose a Category or an Option.");
      } else {
        //console.log("off====", radioResult);
        const finalResult = {
          title: componentTitle,
          id: selectResult["id"],
          name: `${selectResult["generic name"]}`,
          tag: `${textFieldRef.current?.value}`,
          group: radioResult,
        };
        return output(finalResult);
      }
    } else {
      if (selectResult === false || radioResult === 0) {
        alert("Please fill the Group or choose a Category or an Option.");
      } else {
        const finalResult = {
          title: componentTitle,
          id: selectResult["id"],
          name: `${selectResult["generic name"]}`,
          tag: `${textFieldRef.current?.value}`,
          group: radioResult,
        };
        return output(finalResult);
      }
    }
  };
  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={componentTitle} color={componentColor} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <ImageCustom path={componentImage} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <SelectCustom data={componentData} returnResult={setSelectResult} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Element TAG"} color={componentColor} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TextField
          inputRef={textFieldRef}
          inputProps={{ maxLength: 20 }}
          defaultValue={componentTag}
          type="text"
          label="Element tag here !"
          variant="outlined"
        />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Device family"} color={componentColor} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <RadioCustom
          qty={componentRadioNbs}
          state={!componentToggle}
          label={componentLabel}
          returnResult={setRadioResult}
        />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button variant="contained" onClick={handleClickA}>
          Validate !
        </Button>
      </CardActions>
    </Card>
  );
};

export default ElementPanel;
