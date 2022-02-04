import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType, Paragraph, HeadingLevel } from "docx";
import { Table, AlignmentType } from "docx";
// Home made class importation
import { DataBuilder, Proface, docxBuilder } from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/documentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_Quotation(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["quotation"][tongue === 0 ? "uk" : "fr"];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new docxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  // Build the basic main fully iolist project
  const MASTER = Dt.addMandatorySlotTofullIolistProject();
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Transform master iolist to single module list
  const finalModuleList = Tp.addObjectByKey(MASTER);
  // Build hmi + module nomenclature
  const hmiNomenclature = Dx.nomenclatureHmi();
  const moduleNomenclature = Dx.nomenclatureModule(finalModuleList);
  // Build docxjs table
  const table1 = Dx.docxTable(hmiNomenclature);
  const table2 = Dx.docxTable(moduleNomenclature);
  // DOCXJS QUOTATION DOCUMENT PATTERN //
  const doc = new Document({
    sections: [
      {
        headers: header,
        footers: footer,
        children: [
          // Title rank 1
          new Paragraph({
            text: projectTitle,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            alignment: AlignmentType.CENTER,
          }),
          // Introduction text
          new Paragraph({
            text: speak.text1,
            alignment: AlignmentType.LEFT,
          }),
          // HMI nomenclature title rank 2 n°1
          new Paragraph({
            text: speak.title2,
            heading: HeadingLevel.HEADING_2,
            thematicBreak: false,
            alignment: AlignmentType.LEFT,
          }),
          // Nomenclature for IHM
          new Table({
            columnWidths: [2500, 2800, 7000, 2000],
            rows: table1,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
          // Module nomenclature title rank 2 n°2
          new Paragraph({
            text: speak.title3,
            heading: HeadingLevel.HEADING_2,
            thematicBreak: false,
            alignment: AlignmentType.LEFT,
          }),
          // Nomenclature for IHM
          new Table({
            columnWidths: [2500, 2800, 7000, 2000],
            rows: table2,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      },
    ],
  });
  // Print document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
}
