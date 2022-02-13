import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import { Document, WidthType, ImageRun } from "docx";
import { TableOfContents } from "docx";
import { Table, Paragraph, StyleLevel, HeadingLevel } from "docx";
// Home made class importation
import {
  DataBuilder,
  DocxBuilder,
  Proface,
  AfDocBuilder,
} from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// Images importation for AF document
import { IPLC } from "../image/image_af_plc";
// External datas importation
import language from "../data/language.json";

export function handleClick_AF(rawAbstract, tongue) {
  //
  //console.log("rawAbstract", rawAbstract);
  //
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak =
    choosenLanguage["functionalAnalysis"][tongue === 0 ? "uk" : "fr"];
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Afb = new AfDocBuilder(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary, MASTER2 => tagList dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  const MASTER_TAG = Dt.tagListObject();
  const MASTER_ID = Dt.idListObject();
  // Get number of group
  const GrpNumber = rawAbstract.Project.Group;
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Function, variable and object which compose functional analysis
  const children = [];
  const hmiNbs = rawAbstract.Project.Group;
  const hmiSeries = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "Series"
  );
  const nameRefDoc = speak.refDocTable[3][1];
  const nameRefDocPLC = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "PLC_documentation"
  );
  const image6 = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(IPLC, "base64"),
        transformation: {
          width: 120,
          height: 120,
        },
      }),
    ],
  });
  const nameRefDocHMI = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "HMI_documentation"
  );
  // Build table of content
  const tableOfContent = Afb.tableOfContents();
  children.push(tableOfContent);
  // Build document presentation title
  const title1 = Afb.makeAfTitleRankX(speak.title1, 1);
  children.push(title1);
  // Build introduction text
  const rawIntro1 = speak.text1 + projectTitle;
  const intro1 = Afb.makeAfText(rawIntro1);
  children.push(intro1);
  // Build reference document title
  const title2 = Afb.makeAfTitleRankX(speak.title2, 1);
  children.push(title2);
  // Build reference document text above table
  const refDocTableText1 = Afb.makeAfText(speak.refDocTableText1);
  children.push(refDocTableText1);
  // Build reference document table
  const table1 = Afb.makeAfTable(speak.refDocTable);
  children.push(table1);
  // Build installation architecture title
  const title3 = Afb.makeAfTitleRankX(speak.title3, 1);
  children.push(title3);
  // Build description text 3
  const dataListForCustomText3 = [hmiNbs, hmiSeries, nameRefDoc];
  const rawText3 = Dx.makeDocxjsCustomText(
    speak.installArchText3,
    dataListForCustomText3
  );
  const text3 = Afb.makeAfText(rawText3);
  children.push(text3);
  // Build element listing title
  const title4 = Afb.makeAfTitleRankX(speak.title4, 1);
  children.push(title4);
  // Build description text 4
  const text4 = Afb.makeAfText(speak.elemListText4);
  children.push(text4);
  // Build network architecture title
  const title5 = Afb.makeAfTitleRankX(speak.title5, 1);
  children.push(title5);
  // Build description text 5
  const text5 = Afb.makeAfText(speak.netArchText5);
  children.push(text5);
  // Build PLC settings title
  const title6 = Afb.makeAfTitleRankX(speak.title6, 1);
  children.push(title6);
  // Build description text 6 ABC
  const dataListForCustomText6A = [hmiNbs, hmiNbs, hmiSeries];
  const rawtext6A = Dx.makeDocxjsCustomText(
    speak.plcSettingText6A,
    dataListForCustomText6A
  );
  const text6A = Afb.makeAfText(rawtext6A);
  children.push(text6A);
  const dataListForCustomText6B = [nameRefDocPLC];
  const rawtext6B = Dx.makeDocxjsCustomText(
    speak.plcSettingText6B,
    dataListForCustomText6B
  );
  const text6B = Afb.makeAfText(rawtext6B);
  children.push(text6B);
  children.push(image6); // Add PLC explicative image
  const text6C = Afb.makeAfText(speak.plcSettingText6C);
  children.push(text6C);
  // Build HMI settings title
  const title7 = Afb.makeAfTitleRankX(speak.title7, 1);
  children.push(title7);
  // Build HMI settings text
  const rawText7 = Dx.makeDocxjsCustomText(speak.hmiSettingText7, [
    nameRefDocHMI,
  ]);
  const text7 = Afb.makeAfText(rawText7);
  children.push(text7);
  // Build HMI settings table
  const table7 = Afb.makeAfTable(speak.hmiSettTable);
  children.push(table7);
  // Build abbreviations title
  const title8 = Afb.makeAfTitleRankX(speak.title8, 1);
  children.push(title8);
  // Build abbreviations table
  const table8 = Afb.makeAfTable(speak.abbrvTable);
  children.push(table8);
  // Build Operation install title & text
  const title9 = Afb.makeAfTitleRankX(speak.title9, 1);
  children.push(title9);
  const text9 = Afb.makeAfText(speak.opeInstText9);
  children.push(text9);
  //**************//
  // -- Automatic build for elements chapter --
  const elementsMainObject = Afb.makeWorkingBasisObjectForAf();
  //console.log("elementsMainObject", elementsMainObject);
  for (const item of Object.keys(elementsMainObject)) {
    // console.log(item);
    // Push title rank 1
    children.push(Afb.makeAfTitleRankX(speak[item].title, 1));
    // Push main intro text
    if (speak[item].infos !== "") {
      children.push(Afb.makeAfText(speak[item].infos));
    }
    for (const [key, value] of Object.entries(elementsMainObject[item])) {
      console.log(key);
      // Push sub title rank 2
      children.push(Afb.makeAfTitleRankX(speak[key].title, 2));
      // Push sub title rank 3 A
      children.push(Afb.makeAfTitleRankX(speak.subTitleA, 3));
      // Push element general information
      children.push(Afb.makeAfText(speak[key]["A-infos"]));
      // Push sub title rank 3 B
      children.push(Afb.makeAfTitleRankX(speak.subTitleB, 3));
      // Push intro part B
      children.push(Afb.makeAfText(speak[key]["B-intro"]));
      // Push tags bullet list in part B
      const bulletList = Afb.makeAfBullet(speak[key]["B-tags"]);
      children.push(bulletList[0]);
      // Push sub title rank 3 C
      children.push(Afb.makeAfTitleRankX(speak.subTitleC, 3));
      const keyTupleList = elementsMainObject[item][key];
      const firstRow = speak["ccTableRow"];
      const target = "AF";
      console.log(keyTupleList, firstRow);
      const tableC = Afb.makeAfControlCommandTable(
        keyTupleList,
        firstRow,
        target,
        flag
      );
      console.log(tableC);
      // Push sub title rank 3 D
      children.push(Afb.makeAfTitleRankX(speak.subTitleD, 3));
    }
  }

  //**************//
  // Architecture pattern document
  const doc = new Document({
    features: {
      updateFields: true,
    },
    sections: [
      {
        headers: header,
        footers: footer,
        children: children,
      },
    ],
  });
  /* // Print document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  }); */
  return false;
}
