import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, Stack, Avatar } from "@mui/material";
import RequestCards from "../components/RequestCards";
import { documentConstructorForQts } from "../assets/backend/Chiffrage/Constructor";
import { documentConstructorForArchitecture } from "../assets/backend/Architecture/Constructor";
import { documentConstructorForIOList } from "../assets/backend/IOliste/Constructor";
import { documentConstructorForAf } from "../assets/backend/Analyse Fonctionelle/Constructor";
import contents from "./json/lastPage.json";
// Load text information to display for Requestcards elements
const content = JSON.parse(JSON.stringify(contents));

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const rawAbstract = { ...location.state };
  //console.log(rawAbstract);
  // Avatar settings
  const avtConf = { width: 38, height: 38 };
  // Last page //
  return (
    <div className="grid-container-last-page">
      <div className="head"></div>
      <div className="leftp"></div>
      <div className="rightp"></div>
      {/* Quotation */}
      <div className="r1">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.quot.title}
            text={content.quot.text}
            color={content.quot.color}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => documentConstructorForQts(rawAbstract, "uk")}
            >
              <Avatar alt="UK flag" src="/images/flag-uk.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => documentConstructorForQts(rawAbstract, "fr")}
            >
              <Avatar alt="FR flag" src="/images/flag-fr.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
      {/* Functional Analysis */}
      <div className="r2">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.doc.title}
            text={content.doc.text}
            color={content.doc.color}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => documentConstructorForAf(rawAbstract, "uk")}
            >
              <Avatar alt="UK flag" src="/images/flag-uk.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => documentConstructorForAf(rawAbstract, "fr")}
            >
              <Avatar alt="FR flag" src="/images/flag-fr.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
      {/* Architecture */}
      <div className="r3">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.arch.title}
            text={content.arch.text}
            color={content.arch.color}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                documentConstructorForArchitecture(rawAbstract, "uk");
              }}
            >
              <Avatar alt="UK flag" src="/images/flag-uk.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                documentConstructorForArchitecture(rawAbstract, "fr");
              }}
            >
              <Avatar alt="FR flag" src="/images/flag-fr.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
      {/* IOList */}
      <div className="r4">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={content.IOList.title}
            text={content.IOList.text}
            color={content.IOList.color}
          />
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                documentConstructorForIOList(rawAbstract, "uk");
              }}
            >
              <Avatar alt="UK flag" src="/images/flag-uk.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                documentConstructorForIOList(rawAbstract, "fr");
              }}
            >
              <Avatar alt="FR flag" src="/images/flag-fr.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default LastPage;
