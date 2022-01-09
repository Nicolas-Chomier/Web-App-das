import React, { useState } from "react";
import dataCore from "../assets/data/dataCore.json";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TitleTile from "../components/TitleTile";
import TechnoTile from "../components/TechnoTile";
import OptionTile from "../components/OptionTile";
import SwitchTile from "../components/SwitchTile";
import { grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";

// Importation of main datas sources
const datas = JSON.parse(JSON.stringify(dataCore));

const LandingPage = () => {
  //const componentData = data["data"];
  // Fields to fill:
  const [text, setText] = useState("");
  const [techno, setTechno] = useState(false);
  // HMI choice numbers
  const [option, setOption] = useState(false);
  // Open air toggle switch boolean
  const [option2, setOption2] = useState(false);
  // Send data to next page when click validation btn
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
  // Landing Page //
  return (
    <div className="grid-container-landing-page">
      <div className="headers"></div>
      <div className="lpanel"></div>
      <div className="rpanel"></div>
      <div className="title">
        <TitleTile title={"Nom du projet"} output={setText} />
      </div>
      <div className="technology">
        <TechnoTile title={"Technologie"} datas={datas} output={setTechno} />
        {/* <TechnoSection datas={datas} output={setTechno} /> */}
      </div>
      <div className="optionTile">
        <OptionTile title={"Nombre d'IHM"} output={setOption} />
      </div>
      <div className="switchTile">
        <SwitchTile title={"Open Air"} output={setOption2} />
      </div>
      <div className="validation">
        <Button
          sx={{ bgcolor: grey[800], mx: "1vw", my: "1vh" }}
          size="large"
          variant="contained"
          onClick={handleClick}
          endIcon={<SendIcon />}
        >
          Valider vos choix
        </Button>
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default LandingPage;
