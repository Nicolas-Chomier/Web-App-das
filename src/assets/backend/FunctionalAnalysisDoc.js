import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType } from "docx";
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
// External datas importation
import language from "../data/language.json";

export function handleClick_AF(rawAbstract, tongue) {
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
  // Build reference document table
  const rawRefDocTable = [
    ["test"],
    ["t", "ze", "rt"],
    ["eee", "eee", "eee"],
    ["aaa", "aaa", "aaa"],
  ];
  const table1 = Afb.makeAfTable(rawRefDocTable);
  children.push(table1);
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
