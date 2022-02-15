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
import language from "../data/language/AF.json";

export function handleClick_AF(rawAbstract, tongue) {
  //
  console.log("rawAbstract", rawAbstract);
  //
  // Load and parse special datas from JSON
  const text = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  const speak = text[flag];
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
  // ---- Build CHAPTER 0 "Table of content" ---- //
  const tableOfContent = Afb.tableOfContents();
  children.push(tableOfContent);
  // ---- Build CHAPTER 1 "Document presentation" ---- //
  const title1 = Afb.makeAfTitleRankX(speak.title1, 1);
  const text1 = Afb.makeAfText(speak.text1 + projectTitle);
  children.push(title1, text1);
  // ---- Build CHAPTER 2 "Reference document" ---- //
  const title2 = Afb.makeAfTitleRankX(speak.title2, 1);
  const text2 = Afb.makeAfText(speak.text2);
  const table2 = Afb.makeAfTable(speak.table2);
  children.push(title2, text2, table2);
  // ---- Build CHAPTER 3 "Installation architecture" ---- //
  const hmiNbs = rawAbstract.Project.Group;
  const hmiSeries = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "Series"
  );
  const nameRefDoc = speak.table2[3][1];
  const rawText3 = Dx.makeDocxjsCustomText(speak.text3, [
    hmiNbs,
    hmiSeries,
    nameRefDoc,
  ]);
  const title3 = Afb.makeAfTitleRankX(speak.title3, 1);
  const text3 = Afb.makeAfText(rawText3);
  children.push(title3, text3);
  // ---- Build CHAPTER 4 "Element listing" ---- //
  const title4 = Afb.makeAfTitleRankX(speak.title4, 1);
  const text4 = Afb.makeAfText(speak.text4);
  children.push(title4, text4);
  // ---- Build CHAPTER 5 "Network architecture" ---- //
  const title5 = Afb.makeAfTitleRankX(speak.title5, 1);
  const text5 = Afb.makeAfText(speak.text5);
  children.push(title5, text5);
  // ---- Build CHAPTER 6 "PLC settings" ---- //
  const nameRefDocPLC = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "PLC_documentation"
  );
  const rawtext6A = Dx.makeDocxjsCustomText(speak.text6A, [
    hmiNbs,
    hmiNbs,
    hmiSeries,
  ]);
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
  const rawtext6B = Dx.makeDocxjsCustomText(speak.text6B, [nameRefDocPLC]);
  const title6 = Afb.makeAfTitleRankX(speak.title6, 1);
  const text6A = Afb.makeAfText(rawtext6A);
  const text6B = Afb.makeAfText(rawtext6B);
  const text6C = Afb.makeAfText(speak.text6C);
  children.push(title6, text6A, image6, text6B, text6C);
  // ---- Build CHAPTER 7 "HMI settings" ---- //
  const nameRefDocHMI = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "HMI_documentation"
  );
  const rawText7 = Dx.makeDocxjsCustomText(speak.text7, [nameRefDocHMI]);
  const title7 = Afb.makeAfTitleRankX(speak.title7, 1);
  const text7 = Afb.makeAfText(rawText7);
  const table7 = Afb.makeAfTable(speak.table7);
  children.push(title7, text7, table7);
  // ---- Build CHAPTER 8 "Abbreviations" ---- //
  const title8 = Afb.makeAfTitleRankX(speak.title8, 1);
  const table8 = Afb.makeAfTable(speak.table8);
  children.push(title8, table8);
  // ---- Build CHAPTER 9 "Colour code" ---- //
  //WIP
  // ---- Build CHAPTER 10 "Function block description" ---- //
  //WIP
  const fbList = Afb.makeFunctionBlocList();
  console.log(fbList);
  // ---- Build CHAPTER 11 "Operation of the installation" ---- //
  const title11 = Afb.makeAfTitleRankX(speak.title11, 1);
  const text11 = Afb.makeAfText(speak.text11);
  children.push(title11, text11);
  // ---- Build CHAPTER 12 + "Instrumentation + Process component + ..." ---- //
  const elementsMainObject = Afb.makeWorkingBasisObjectForAf();
  for (const item of Object.keys(elementsMainObject)) {
    // Push title rank 1
    children.push(Afb.makeAfTitleRankX(speak[item].title, 1));
    // Push main intro text
    if (speak[item].infos !== "") {
      children.push(Afb.makeAfText(speak[item].infos));
    }
    for (const key of Object.keys(elementsMainObject[item])) {
      // Variables
      const keyTupleList = elementsMainObject[item][key];
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
      // Build control command table part C
      const firstRowC = speak["ccTableRow"];
      const rawTableC = Afb.makeAfCustomTable(keyTupleList, firstRowC, flag);
      children.push(Afb.makeAfTable(rawTableC));
      // Push sub title rank 3 D
      children.push(Afb.makeAfTitleRankX(speak.subTitleD, 3));
      // Build faults table part D
      const firstRowD = speak["faultTableRow"];
      const rawTableD = Afb.makeAfFaultTable(keyTupleList, firstRowD, flag);
      children.push(Afb.makeAfTable(rawTableD));
    }
  }
  // ---- Build CHAPTER XX "" ---- //
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
  // Print document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
  return false;
}
