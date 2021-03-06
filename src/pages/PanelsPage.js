import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import publics from "./json/public.json";
import ElementPanel from "../components/ElementPanel";
import TableCustom from "../components/TableCustom";

// Importation for main datas sources
const publicDatas = JSON.parse(JSON.stringify(publics));

const PanelsPage = () => {
  // Variable for next page
  const navToLastPage = useNavigate();
  // Datas from previous page:
  const location = useLocation();
  const projectData = location.state;
  // All panel datas attribution (by category):
  const Instrumentations = publicDatas.Instrumentations;
  const Process_components = publicDatas.Process_components;
  const Valves_and_dampers = publicDatas.Valves_and_dampers;
  const Analyzer = publicDatas.Analyzer;
  const opt = projectData.OpenAir; // Depend on Open Air option chossen or not:
  const Fluid_supply = publicDatas.Fluid_supply;
  const OpenAir = publicDatas.OpenAir;
  const Devices = publicDatas.Devices;
  // Result from choice on different panels (false protect against empty entry when page build/refresh)
  const [config, setConfig] = useState(false);
  // Result read from abstract table
  const [abstract, setAbstract] = useState("");
  //
  useEffect(() => {
    // Send data to last page if data exist
    if (abstract.length !== 0 && projectData.length !== 0) {
      navToLastPage("/last", {
        state: {
          Project: projectData,
          Elements: abstract,
        },
      });
      // Trap first loading page
    } else if (abstract.length === 0) {
      console.log(":)");
    } else {
      alert("Something wrong append, please restart application");
      // Faire qqchose pour refresh all !!
    }
  }, [abstract, projectData, navToLastPage]);
  // Panels Page //
  return (
    <div className="grid-container-panels-page">
      <div className="head"></div>
      <div className="leftp"></div>
      <div className="rightp"></div>
      <div className="p1">
        <ElementPanel
          data={Instrumentations}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p2">
        <ElementPanel
          data={Process_components}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p3">
        <ElementPanel
          data={Valves_and_dampers}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p4">
        <ElementPanel data={Analyzer} config={projectData} output={setConfig} />
      </div>
      <div className="p5">
        <ElementPanel
          data={opt === false ? Fluid_supply : OpenAir}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p6">
        <ElementPanel data={Devices} config={projectData} output={setConfig} />
      </div>
      <div className="tables">
        <TableCustom item={config} output={setAbstract} />
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default PanelsPage;
