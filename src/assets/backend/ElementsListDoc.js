import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
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
  Footer,
  WidthType,
  Table,
  Header,
  Paragraph,
  AlignmentType,
  ImageRun,
  HeadingLevel,
  TextRun,
} from "docx";

export function handleClick_ElementsList(rawAbstract, flag) {
  console.log("pop!!", flag);
  // Instantiation of the document design class
  const Dx = new docxBuilder(rawAbstract);
  // Main project title
  const documentTitle = Dx.buildTitle();
  // test
  const tabletest = Dx.buildElementsIolistTable();
  // ...
  const table1 = Dx.docxTable(tabletest);
  // Variable declaration for quotation document only in FR and UK
  const conf = {
    uk: {
      text1: `This document describe the material architecture for ${documentTitle} project`,
      docName: "Elem IO list",
    },
    fr: {
      text1: `Ce document décrit l'Architecture Materiel pour le projet ${documentTitle}`,
      docName: "Elem IO list",
    },
  };
  // ........................... //
  // DOCXJS ARCHITECTURE PATTERN //
  // ........................... //
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
          // ...
          new Table({
            columnWidths: [500, 1000, 800, 800, 800, 800, 800, 800],
            rows: table1,
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
