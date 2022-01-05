import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ElementPanel from "../components/ElementPanel";
import TableCustom from "../components/TableCustom";

const PanelsPage = () => {
  // Variable for next page
  const navToLastPage = useNavigate();
  // Datas from previous page:
  const location = useLocation();
  const projectData = location.state;
  // Panel datas attribution (Instrumentation):
  const instrumentation = location.state.datas.Instrumentations;
  // Panel datas attribution (Compresseurs):
  const compresseurs = location.state.datas.Compresseurs;
  // Result from choice on different panels (false protect against empty entry when page build/refresh)
  const [config, setConfig] = useState(false);
  // Result read from abstract table
  const [abstract, setAbstract] = useState("");
  //
  useEffect(() => {
    if (abstract.length !== 0) {
      navToLastPage("/last", {
        state: {
          Project: projectData,
          Elements: abstract,
        },
      });
    } else {
      alert("Something wrong append, please restart application");
      // Faire qqchose pour refresh all !!
    }
  }, [abstract, projectData, navToLastPage]);

  // Panels Page //
  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <ElementPanel
            data={instrumentation}
            config={projectData}
            output={setConfig}
          />
        </Grid>
        <Grid item xs={6}>
          <ElementPanel
            data={compresseurs}
            config={projectData}
            output={setConfig}
          />
        </Grid>
        <Grid item xs={8}>
          <TableCustom item={config} output={setAbstract} />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              console.log("projectData", projectData);
              console.log("config", config);
              console.log("abstract", abstract);
            }}
          >
            TEST ONLY !
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PanelsPage;
