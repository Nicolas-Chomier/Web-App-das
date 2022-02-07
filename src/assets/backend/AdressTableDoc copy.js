import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType, Paragraph, HeadingLevel } from "docx";
import { Table, AlignmentType } from "docx";
// Home made class importation
import {
  DataBuilder,
  DocxBuilder,
  Proface,
  AdressTableDocBuilder,
} from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_AdressTable(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["architecture"][tongue === 0 ? "uk" : "fr"];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Atb = new AdressTableDocBuilder(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary, MASTER2 => tagList dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  const MASTER_TAG = Dt.tagListObject();
  // Get number of group
  const GrpNumber = rawAbstract.Project.Group;
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Build a raw list with all important infos
  function buildRawArrayOfDatas(MASTER_IO, MASTER_TAG) {
    const EmptyRawArray = [];
    const limit = ["module10", "module11", "module12"];
    for (let i = 1; i < GrpNumber + 1; i++) {
      for (const [key, value] of Object.entries(MASTER_IO[i])) {
        const isEmpty = !Object.values(value).some((x) => x !== 0);
        if (isEmpty !== true) {
          const tagList = MASTER_TAG[i][key];
          const lineUp = Tp.moduleBuilder(value);
          for (const [module, number] of Object.entries(lineUp)) {
            if (number !== 0 && limit.includes(module) === false) {
              //const partTitle =
              const listWithTag = Atb.reshapeTagList(tagList, module);
              EmptyRawArray.push(listWithTag);
            }
          }
        }
      }
    }
    return EmptyRawArray;
  }
  // Main document title
  const docTitle = new Paragraph({
    text: projectTitle,
    heading: HeadingLevel.HEADING_1,
    thematicBreak: false,
    alignment: AlignmentType.CENTER,
  });
  // Document text introduction
  const docIntro = new Paragraph({
    text: speak.text1,
    alignment: AlignmentType.LEFT,
  });
  // First document row
  const firstRowText = [["Name", "Type", "N°", "Board tag"]];
  const firstRow = Dx.docxTable(firstRowText);
  const firstRowDocxjs = new Table({
    columnWidths: [1200, 600, 500, 1500],
    rows: firstRow,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
  // Build the table wich will displayed with DOCXJS method & raw list above
  const children = [docTitle, docIntro, firstRowDocxjs];
  const EmptyRawArray = buildRawArrayOfDatas(MASTER_IO, MASTER_TAG);
  for (const item of EmptyRawArray) {
    console.log(item);
    const _table = Dx.docxTable(item);
    children.push(
      // Adress list table
      new Table({
        columnWidths: [1200, 600, 500, 1500],
        rows: _table,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      })
    );
  }
  // AdressTable pattern
  const doc = new Document({
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
