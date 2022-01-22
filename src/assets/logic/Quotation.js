import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import { DocumentTools, Proface, docxBuilder } from "./Toolbox";
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
} from "docx";

export function handleClick_Quotation(rawAbstract) {
  // Instantiation of the Document Tools class
  const Dt = new DocumentTools(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface();
  // Instantiation of the document design class
  const Wx = new docxBuilder();
  // Main project title
  const t1 = Dt.Buildtitle();
  // Build fully main IOList
  const fullIOlist = Dt.ioListBuilder();
  // Build main module line
  const mod1 = Tp.totalModule(fullIOlist);
  // Build open air compressor module line
  const mod2 = Dt.openAirModule();
  // Merge this two module line up
  const mergedModules = Dt.mergeModuleLine(mod1, mod2);
  // Build general module nomenclature
  const HmiNomenclature = Dt.nomenclatureHmi();
  const elementsNomenclature = Dt.nomenclatureModule(mergedModules);
  // Print wordx table with nomenclature
  const table1 = Wx.docxTable(HmiNomenclature);
  const table2 = Wx.docxTable(elementsNomenclature);
  // Varable declaration for quotation document only
  const conf = {
    // Size for image document header:
    width: 120,
    height: 110,
    title1: t1,
    text1:
      "Bonjour, veuillez trouver dans ce document une demande de chiffrage pour les références et les quantités suivantes :",
    title2: "2. NOMENCLATURE IHM",
    title3: "3. NOMENCLATURE MODULES",
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
                  }),
                ],
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

  Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "example.docx");
    console.log("Document created successfully");
  });
}
