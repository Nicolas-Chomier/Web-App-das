import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType, Paragraph, HeadingLevel } from "docx";
import { Table, AlignmentType } from "docx";
// Home made class importation
import { DataBuilder, Proface, DocxBuilder } from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language/QTS.json";

export function handleClick_QTS(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const text = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  const speak = text[flag];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Transform master iolist to single module list
  const finalModuleList = Tp.addObjectByKey(MASTER_IO);
  // Build hmi + module nomenclature
  const hmiNomenclature = Dx.nomenclatureHmi();
  const moduleNomenclature = Dx.nomenclatureModule(finalModuleList);
  // Build docxjs table
  const table1 = Dx.docxTable(hmiNomenclature);
  const table2 = Dx.docxTable(moduleNomenclature);
  // Quotation pattern
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