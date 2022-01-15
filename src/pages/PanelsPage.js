import React, { useState, useEffect } from "react";
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
  // All panel datas attribution (by category):
  const instrum = location.state.datas.Instrumentations;
  const Auxiliaires = location.state.datas.Auxiliaires;
  const piloted = location.state.datas.Eléments_pilotés;
  const analyzer = location.state.datas.Analiseurs;
  // Depend on Open Air option chossen or not:
  const opt = projectData.Option2;
  const machine = location.state.datas.Compresseurs;
  const openair = location.state.datas.OpenAir;
  // Result from choice on different panels (false protect against empty entry when page build/refresh)
  const [config, setConfig] = useState(false);
  // Result read from abstract table
  const [abstract, setAbstract] = useState("");
  //
  useEffect(() => {
    if (abstract.length !== 0 && projectData.length !== 0) {
      navToLastPage("/last", {
        state: {
          Project: projectData,
          Elements: abstract,
        },
      });
    } else if (abstract.length === 0) {
      console.log("trap");
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
        <ElementPanel data={instrum} config={projectData} output={setConfig} />
      </div>
      <div className="p2">
        <ElementPanel
          data={Auxiliaires}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p3">
        <ElementPanel data={piloted} config={projectData} output={setConfig} />
      </div>
      <div className="p4">
        <ElementPanel data={analyzer} config={projectData} output={setConfig} />
      </div>
      <div className="p5">
        <ElementPanel
          data={opt === false ? machine : openair}
          config={projectData}
          output={setConfig}
        />
      </div>
      <div className="p6">
        {/* <ElementPanel data={} config={projectData} output={setConfig} /> */}
      </div>
      <div className="tables">
        <TableCustom item={config} output={setAbstract} />
      </div>
      <div className="bott"></div>
    </div>
  );
};

export default PanelsPage;
