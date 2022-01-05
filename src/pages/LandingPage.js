import React, { useState, useEffect } from "react";
import { Grid, Button, CardActions, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dataCore from "../assets/data/dataCore.json";
import TitleSection from "../components/TitleSection";
import TechnoSection from "../components/TechnoSection";
import OptionSection from "../components/OptionSection";
import StatusSection from "../components/StatusSection";
import SendIcon from "@mui/icons-material/Send";

// Importation of main datas sources
const datas = JSON.parse(JSON.stringify(dataCore));

const LandingPage = () => {
  //const componentData = data["data"];
  // Fields to fill:
  const [text, setText] = useState("");
  const [techno, setTechno] = useState(false);
  const [option, setOption] = useState(false);
  const [option2, setOption2] = useState(false);
  // Send data to next page
  const navigate = useNavigate();
  const handleClick = () => {
    if (text === "") {
      alert("Please fill text field");
    } else if (techno === false) {
      alert("Please fill techno ");
    } else if (option === false) {
      alert("Please fill option ");
    } else {
      navigate("/panels", {
        state: {
          Title: text,
          Technology: techno,
          Option: option,
          Option2: option2,
          datas: datas,
        },
      });
    }
  };
  // Refresh status from fields to fill
  useEffect(() => {}, [text, techno, option, option2]);
  // Landing Page //
  return (
    <Grid container rowSpacing={2} alignItems="center" justify="center">
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={10}>
        <TitleSection output={setText} />
      </Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={10}>
        <TechnoSection datas={datas} output={setTechno} />
      </Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={10}>
        <OptionSection output={setOption} output2={setOption2} />
      </Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={10}>
        <StatusSection
          status1={text}
          status2={techno}
          status3={option}
          status4={option2}
        />
      </Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={1}></Grid>
      <Grid item md={4} xs={10}>
        <Card sx={{ maxWidth: 350 }}>
          <CardActions sx={{ justifyContent: "center" }}>
            <Typography variant="h5" color="primary" align="center">
              Validation des choix de conception
            </Typography>
          </CardActions>
          <CardActions sx={{ mb: 1.5, justifyContent: "center" }}>
            <Button
              /* sx={{ bgcolor: "blue" }} */
              size="large"
              variant="contained"
              onClick={() => {
                handleClick(text, techno, option, option2);
              }}
              color="info"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </CardActions>
          <Grid item md={4} xs={1}></Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
