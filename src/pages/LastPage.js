import React from "react";
import { Button, Card } from "@mui/material";
import { useLocation } from "react-router-dom";
import RequestCards from "../components/RequestCards";
import { generateDocx } from "../assets/logic/document";
//
import { Architecture, IOList, Proface } from "../assets/logic/Builder";

const LastPage = () => {
  // General abstract from PanelsPage
  const location = useLocation();
  const rawAbstract = { ...location.state };
  console.log("rawAbstract", rawAbstract);
  // ................................................................................ test
  // Build basical datas needed for document construction (methods are imported from mainDataBuilder):
  const resultats = new Architecture(rawAbstract).reservedDictionnary();
  console.log("resultats de l'architecture", resultats);
  //
  const liste = new IOList(rawAbstract).mainList(resultats);
  console.log("resultats de l'IO Liste", liste);
  //
  const mod = new Proface(liste[1]).totalModule();
  console.log("modules", mod);
  // ................................................................................
  // styles:
  const btnStyle = { mt: "5px", mb: "8px", color: "#3f4246" };
  // Request cards content for all documentation:
  const contents = {
    doc: {
      title: "Analyse fonctionnelle",
      text: "Génère une analyse fonctionnelle au format Word partiellement complétée avec les informations renseignés dans pages précedentes.",
      color: "#FFBE00",
    },
    quot: {
      title: "Demande de chiffrage",
      text: "Génère une demande de chiffrage au format Word formaté et prète à l'emploi pour toute demande de matériel ou de devis.",
      color: "#97B92D",
    },
    arch: {
      title: "Architecture matériel",
      text: "Génère l'architecture materiel du projet avec les elements renseignés dans pages précedentes correspondant au fabricant sélectionné.",
      color: "#35A55D",
    },
  };
  // Last page //
  return (
    <div className="grid-container-last-page">
      <div className="head"></div>
      <div className="leftp"></div>
      <div className="rightp"></div>
      <div className="r1">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={contents.doc.title}
            text={contents.doc.text}
            color={contents.doc.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={() => {
              console.log("resultats", resultats);
            }}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r2">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={contents.quot.title}
            text={contents.quot.text}
            color={contents.quot.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={generateDocx}
          >
            Valider
          </Button>
        </Card>
      </div>
      <div className="r3">
        <Card sx={{ width: "100%", mx: "1vw" }} elevation={5}>
          <RequestCards
            title={contents.arch.title}
            text={contents.arch.text}
            color={contents.arch.color}
          />
          <Button
            fullWidth={true}
            sx={btnStyle}
            variant="text"
            onClick={generateDocx}
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
