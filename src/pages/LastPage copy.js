import React from "react";
import { Grid, Button, Card } from "@mui/material";
import { useLocation } from "react-router-dom";
import RequestCards from "../components/RequestCards";

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const datas = { ...location.state };
  // Request cards content for word documentation:
  const doc = {
    title: "document word",
    text: "Analyse fonctionelle",
    color: "#af52bf",
  };
  // Request cards content for pdf documentation:
  const pdf = {
    title: "document pdf",
    text: "demmande de chiffrage",
    color: "teal",
  };
  // Request cards content for custom documentation:
  const arch = {
    title: "document custom",
    text: "architecture materielle",
    color: "orange",
  };
  // Function which build documentation
  function genDoc1(d) {
    console.log("... generation de la doc 1", d);
  }
  function genDoc2(d) {
    console.log("... generation de la doc 2", d.Project);
  }
  function genDoc3(d) {
    console.log("... generation de la doc 3", d.Elements);
  }
  //
  return (
    <Grid container rowSpacing={2} alignItems="center" justify="center">
      <Grid item md={4} xs={12}>
        <Card sx={{ maxWidth: 345 }}>
          <RequestCards title={doc.title} text={doc.text} color={doc.color} />
          <Button
            fullWidth={true}
            sx={{ color: doc.color }}
            variant="text"
            onClick={() => {
              genDoc1(datas);
            }}
          >
            Valider
          </Button>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card sx={{ maxWidth: 345 }}>
          <RequestCards title={pdf.title} text={pdf.text} color={pdf.color} />
          <Button
            fullWidth={true}
            sx={{ color: pdf.color }}
            variant="text"
            onClick={() => {
              genDoc2(datas);
            }}
          >
            Valider
          </Button>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card sx={{ maxWidth: 345 }}>
          <RequestCards
            title={arch.title}
            text={arch.text}
            color={arch.color}
          />
          <Button
            fullWidth={true}
            sx={{ color: arch.color }}
            variant="text"
            onClick={() => {
              genDoc3(datas);
            }}
          >
            Valider
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LastPage;
