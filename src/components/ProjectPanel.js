import React, { useState, useRef, useEffect } from "react";
import { Card, CardActions, TextField, Switch, Button } from "@mui/material";
import TitleCustom from "./TitleCustom";
import RadioCustom from "./RadioCustom";
import SelectCustom from "./SelectCustom";

const ProjectPanel = ({ data, returnResult }) => {
  // PROJECT PANEL CONFIG >>
  //const image = "images/instrum.jpg";
  const color = "#1769aa";
  const componentRadioNbs = 5;
  //

  // PROJECT PANEL CONFIG <<
  // Check is true or false according status of toggle switch
  const [check, setCheck] = useState(true);
  const [checkOpenAir, setCheckOpenAir] = useState(true);
  const [checkIhm, setCheckIhm] = useState(true);
  const [selectResult, setSelectResult] = useState(true);
  //
  const title =
    check === false ? (
      <TitleCustom title={"Project panel"} color={color} />
    ) : (
      ""
    );
  //
  const proface =
    checkIhm === false ? (
      <>
        <div>
          <TitleCustom title={"Choix des IHMs"} color={color} />
        </div>
        <div>
          <SelectCustom data={data} returnResult={setSelectResult} />
        </div>
      </>
    ) : (
      ""
    );
  // Radio
  const [radioResult, setradioResult] = useState(0);
  // Get value to text field component
  const textFieldRef = useRef(null);
  // Refresh the data provided by the project panel from the parent
  useEffect(() => {
    if (check === false) {
      const finalResult = {
        title: `${textFieldRef.current?.value}`,
        qty: 1,
        openAir: false,
      };
      returnResult(finalResult);
    } else {
      const finalResult = {
        title: `${textFieldRef.current?.value}`,
        qty: radioResult,
        openAir: true,
      };
      returnResult(finalResult);
    }
  }, [check, radioResult, returnResult]);

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Project panel"} color={"green"} />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TextField
          inputRef={textFieldRef}
          inputProps={{ maxLength: 20 }}
          defaultValue={"New Project"}
          type="text"
          label="Project title here!"
          variant="outlined"
        />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Proface"} color={color} />
        <Switch
          onChange={() => {
            setCheckIhm((prevCheck) => !prevCheck);
          }}
        />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Open Air"} color={color} />
        <Switch
          onChange={() => {
            setCheckOpenAir((prevCheck) => !prevCheck);
          }}
        />
      </CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <TitleCustom title={"Multiple"} color={color} />
        <Switch
          onChange={() => {
            setCheck((prevCheck) => !prevCheck);
          }}
        />
      </CardActions>

      <CardActions sx={{ justifyContent: "center" }}>{title}</CardActions>
      <CardActions sx={{ justifyContent: "center" }}>{proface}</CardActions>
      <CardActions sx={{ justifyContent: "center" }}>
        <RadioCustom
          qty={componentRadioNbs}
          state={check}
          /* label={} */
          align={true}
          returnResult={setradioResult}
          placement={"top"}
        />
      </CardActions>
      <CardActions style={{ justifyContent: "center" }}>
        <Button variant="contained" /* onClick={handleClick} */>
          Validate !
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectPanel;
