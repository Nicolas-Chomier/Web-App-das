import { Packer } from "docx";
import { saveAs } from "file-saver";
import {
  DataArrangement,
  Proface,
  docxBuilder,
} from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/documentHeader";
import { footer } from "../tools/DocumentFooter";
import {
  Document,
  WidthType,
  Table,
  Paragraph,
  AlignmentType,
  HeadingLevel,
} from "docx";

export function handleClick_Quotation(rawAbstract, flag) {
  // Instantiation of the Document Tools class
  const Dt = new DataArrangement(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface(rawAbstract);
  // Instantiation of the document design class
  const Dx = new docxBuilder(rawAbstract);
  // Main project title
  const documentTitle = Dx.buildTitle();
  // Build fully main IOList
  const fullIOlist = Dt.ioListBuilder();
  // Build main module line
  const mod1 = Tp.moduleBuilder(fullIOlist);
  // Build open air compressor module line
  const mod2 = Dt.openAirModule();
  // Merge this two module line up
  const mergedModules = Dt.mergeModuleLine(mod1, mod2);
  // Build general module nomenclature
  const HmiNomenclature = Dx.nomenclatureHmi();
  const elementsNomenclature = Dx.nomenclatureModule(mergedModules);
  // Print wordx table with nomenclature
  const table1 = Dx.docxTable(HmiNomenclature);
  const table2 = Dx.docxTable(elementsNomenclature);
  // Variable declaration for quotation document only in FR and UK
  const conf = {
    uk: {
      text1:
        "Hello, please find in this document a quotation request for the following references and quantities :",
      title2: "2. NOMENCLATURE for HMI",
      title3: "3. NOMENCLATURE for TM3 modules",
      docName: "Quotation request",
    },
    fr: {
      text1:
        "Bonjour, veuillez trouver dans ce document une demande de chiffrage pour les références et les quantités suivantes :",
      title2: "2. NOMENCLATURE des IHM à fournir",
      title3: "3. NOMENCLATURE des modules TM3 à fournir",
      docName: "Demande de chiffrage",
    },
  };
  // ................................. //
  // DOCXJS QUOTATION DOCUMENT PATTERN //
  // ................................. //
  const doc = new Document({
    sections: [
      {
        headers: header,
        footers: footer,
        children: [
          // Title rank 1
          new Paragraph({
            text: documentTitle,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            alignment: AlignmentType.CENTER,
          }),
          // Introduction text
          new Paragraph({
            text: conf[flag].text1,
            alignment: AlignmentType.LEFT,
          }),
          // HMI nomenclature title rank 2 n°1
          new Paragraph({
            text: conf[flag].title2,
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
            text: conf[flag].title3,
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
    saveAs(blob, `${conf[flag].docName}-${documentTitle}.docx`);
  });
}
