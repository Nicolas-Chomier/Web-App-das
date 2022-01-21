import { Architecture, IOList, Proface } from "./Builder";
import { Design } from "./Wordx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import {
  base64Header1,
  base64Header2,
  base64Header3,
  base64Header4,
  base64Header5,
  base64LogoDalkia,
} from "../data/images";
import {
  Document,
  Packer,
  Footer,
  TableRow,
  TableCell,
  WidthType,
  Table,
  Header,
  Paragraph,
  AlignmentType,
  TextRun,
  ImageRun,
  HeadingLevel,
} from "docx";
// ........................ //
// WORDXJS DOCUMENT PATTERN //
// ........................ //
// Image settings on document header:
const width = 120;
const height = 110;
// Title rank 1
const title1 = "PROJET 0";
// Introduction / document presentation text
const paragraphIntro =
  "Bonjour, veuillez trouver dans ce document une demande de chiffrage pour les références et les quantités suivantes :";
// Title rank 2
const title2 = "2. NOMENCLATURE IHM";

const aaa = new Design(4).table(5);
// Title rank 2
const title3 = "3. NOMENCLATURE MODULES";
//
export function generateDocx() {
  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            // Header with images
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: Buffer.from(base64Header1, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header2, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header3, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header4, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header5, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            // Footer with images
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: Buffer.from(base64LogoDalkia, "base64"),
                    transformation: {
                      width: width,
                      height: height,
                    },
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Title rank 1
          new Paragraph({
            text: title1,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            alignment: AlignmentType.CENTER,
          }),
          // Introduction text
          new Paragraph({
            text: paragraphIntro,
            alignment: AlignmentType.LEFT,
          }),
          // HMI nomenclature title rank 2 n°1
          new Paragraph({
            text: title2,
            heading: HeadingLevel.HEADING_2,
            thematicBreak: false,
            alignment: AlignmentType.LEFT,
          }),
          // Nomenclature for IHM
          new Table({
            rows: aaa,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
          // Module nomenclature title rank 2 n°2
          new Paragraph({
            text: title3,
            heading: HeadingLevel.HEADING_2,
            thematicBreak: false,
            alignment: AlignmentType.LEFT,
          }),
          // Nomenclature for IHM
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("0,0")],
                  }),
                  new TableCell({
                    children: [new Paragraph("0,1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("0,2")],
                    rowSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph("0,3")],
                    rowSpan: 3,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("1,0")],
                    columnSpan: 2,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("2,0")],
                    columnSpan: 2,
                  }),
                  new TableCell({
                    children: [new Paragraph("2,2")],
                    rowSpan: 2,
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("3,0")],
                  }),
                  new TableCell({
                    children: [new Paragraph("3,1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("3,3")],
                  }),
                ],
              }),
            ],
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      },
    ],
  });
  // Send document to browser with out FS library (To keep !)
  Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "example.docx");
    console.log("Document created successfully");
  });
}
