import React from "react";
import { Button, Card } from "@mui/material";
import { useLocation } from "react-router-dom";
import RequestCards from "../components/RequestCards";

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const datas = { ...location.state };
  // Request cards content for word documentation:
  const doc = {
    title: "Analyse fonctionnelle",
    text: "Génère une analyse fonctionnelle au format Word partiellement complétée avec les informations renseignés dans pages précedentes.",
    color: "#FFBE00",
  };
  // Request cards content for pdf documentation:
  const pdf = {
    title: "Demande de chiffrage",
    text: "Génère une demande de chiffrage au format Word formaté et prète à l'emploi pour toute demande de matériel ou de devis.",
    color: "#97B92D",
  };
  // Request cards content for custom documentation:
  const arch = {
    title: "Architecture matériel",
    text: "Génère l'architecture materiel du projet avec les elements renseignés dans pages précedentes correspondant au fabricant sélectionné.",
    color: "#35A55D",
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
  // Last page //
  return (
    <div className="grid-container-last-page">
      <div className="head"></div>
      <div className="leftp"></div>
      <div className="rightp"></div>
      <div className="r1">
        <Card sx={{ maxWidth: 345 }} elevation={5}>
          <RequestCards title={doc.title} text={doc.text} color={doc.color} />
          <Button
            fullWidth={true}
            sx={{ mt: "5px", mb: "8px", color: "#3f4246" }}
            variant="text"
            onClick={() => {
              genDoc1(datas);
            }}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r2">
        <Card sx={{ maxWidth: 345 }} elevation={5}>
          <RequestCards title={pdf.title} text={pdf.text} color={pdf.color} />
          <Button
            fullWidth={true}
            sx={{ mt: "5px", mb: "8px", color: "#3f4246" }}
            variant="text"
            onClick={() => {
              genDoc2(datas);
            }}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r3">
        <Card sx={{ maxWidth: 345 }} elevation={5}>
          <RequestCards
            title={arch.title}
            text={arch.text}
            color={arch.color}
          />
          <Button
            fullWidth={true}
            sx={{ mt: "5px", mb: "8px", color: "#3f4246" }}
            variant="text"
            onClick={() => {
              genDoc3(datas);
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
