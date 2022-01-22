import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Card } from "@mui/material";
import RequestCards from "../components/RequestCards";
import { handleClick_Quotation } from "../assets/logic/Quotation";
import contents from "../assets/data/lastPageDatas.json";

// Load text information to display for Requestcards elements
const content = JSON.parse(JSON.stringify(contents));
//
const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const rawAbstract = { ...location.state };
  //console.log("rawAbstract", rawAbstract);
  // Boutton styles:
  const btnStyle = { mt: "5px", mb: "8px", color: "#3f4246" };
  // Last page //
  return (
    <div className="grid-container-last-page">
      <div className="head"></div>
      <div className="leftp"></div>
      <div className="rightp"></div>
      <div className="r1">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.quot.title}
            text={content.quot.text}
            color={content.quot.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={() => handleClick_Quotation(rawAbstract)}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r2">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.doc.title}
            text={content.doc.text}
            color={content.doc.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={() => {
              console.log("Functional Analisys WIP");
            }}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r3">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.arch.title}
            text={content.arch.text}
            color={content.arch.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={() => {
              console.log("Architecture WIP");
            }}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default LastPage;
