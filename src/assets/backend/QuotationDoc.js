import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import {
  DataArrangement,
  Proface,
  docxBuilder,
} from "../tools/DocumentBuilder";
import {
  base64Header1,
  base64Header2,
  base64Header3,
  base64Header4,
  base64Header5,
  base64LogoDalkia,
} from "../image/images.js";
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

export function handleClick_Quotation(rawAbstract) {
  // Instantiation of the Document Tools class
  const Dt = new DataArrangement(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface(rawAbstract);
  // Instantiation of the document design class
  const Dx = new docxBuilder(rawAbstract);
  // Main project title
  const t1 = Dx.buildTitle();
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
  // Variable declaration for quotation document only
  const conf = {
    // Size for image document header:
    width: 120,
    height: 110,
    title1: t1,
    text1:
      "Bonjour, veuillez trouver dans ce document une demande de chiffrage pour les références et les quantités suivantes :",
    title2: "2. NOMENCLATURE des IHM à fournir",
    title3: "3. NOMENCLATURE des modules TM3 à fournir",
    name: "Nicolas CHOMIER",
    mail: "nicolaschomier@dalkiaairsolutions.fr",
  };
  // ................................. //
  // DOCXJS QUOTATION DOCUMENT PATTERN //
  // ................................. //
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
                      width: conf.width,
                      height: conf.height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header2, "base64"),
                    transformation: {
                      width: conf.width,
                      height: conf.height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header3, "base64"),
                    transformation: {
                      width: conf.width,
                      height: conf.height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header4, "base64"),
                    transformation: {
                      width: conf.width,
                      height: conf.height,
                    },
                  }),
                  new ImageRun({
                    data: Buffer.from(base64Header5, "base64"),
                    transformation: {
                      width: conf.width,
                      height: conf.height,
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
                      width: conf.width,
                      height: conf.height,
                    },
                    floating: {
                      horizontalPosition: {
                        offset: 700000,
                      },
                      verticalPosition: {
                        offset: 9250000,
                      },
                    },
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: conf.name,
                    bold: true,
                    font: "Calibri",
                    size: 20,
                    color: "2E2E2E",
                  }),

                  new TextRun({
                    break: 1,
                  }),
                  new TextRun({
                    text: conf.mail,
                    bold: true,
                    font: "Calibri",
                    size: 20,
                    color: "2E2E2E",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        children: [
          // Title rank 1
          new Paragraph({
            text: conf.title1,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            alignment: AlignmentType.CENTER,
          }),
          // Introduction text
          new Paragraph({
            text: conf.text1,
            alignment: AlignmentType.LEFT,
          }),
          // HMI nomenclature title rank 2 n°1
          new Paragraph({
            text: conf.title2,
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
            text: conf.title3,
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
    console.log(blob);
    saveAs(blob, "Quotation doc.docx");
    console.log("Document created successfully");
  });
}
