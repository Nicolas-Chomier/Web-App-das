import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, Stack, Avatar } from "@mui/material";
import RequestCards from "../components/RequestCards";
import { handleClick_Quotation } from "../assets/backend/QuotationDoc";
import { handleClick_Architecture } from "../assets/backend/ArchitectureDoc";
import { handleClick_ElementsList } from "../assets/backend/ElementsListDoc";
import contents from "../assets/data/lastPageDatas.json";

// Load text information to display for Requestcards elements
const content = JSON.parse(JSON.stringify(contents));

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const rawAbstract = { ...location.state };
  // Avatar settings
  const avtConf = { width: 38, height: 38 };
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
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => handleClick_Quotation(rawAbstract, 0)}
            >
              <Avatar alt="UK flag" src="/UKFlag.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => handleClick_Quotation(rawAbstract, 1)}
            >
              <Avatar alt="FR flag" src="/FRFlag.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
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
              onClick={() => {
                console.log("AF WIP - UK");
              }}
            >
              <Avatar alt="UK flag" src="/UKFlag.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                console.log("AF WIP - FR");
              }}
            >
              <Avatar alt="FR flag" src="/FRFlag.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
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
                handleClick_Architecture(rawAbstract, 0);
              }}
            >
              <Avatar alt="UK flag" src="/UKFlag.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                handleClick_Architecture(rawAbstract, 1);
              }}
            >
              <Avatar alt="FR flag" src="/FRFlag.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
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
                handleClick_ElementsList(rawAbstract, 0);
              }}
            >
              <Avatar alt="UK flag" src="/UKFlag.png" sx={avtConf} />
            </Button>
            <Button
              className="flag-btn"
              variant="outlined"
              onClick={() => {
                handleClick_ElementsList(rawAbstract, 1);
              }}
            >
              <Avatar alt="FR flag" src="/FRFlag.png" sx={avtConf} />
            </Button>
          </Stack>
        </Card>
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default LastPage;
