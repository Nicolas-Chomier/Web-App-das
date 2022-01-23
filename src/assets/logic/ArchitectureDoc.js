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
  TextRun,
} from "docx";

export function handleClick_Architecture(rawAbstract) {
  // Instantiation of the Document Tools class
  const Dt = new DocumentTools(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface();
  // Instantiation of the document design class
  const Wx = new docxBuilder();
  // Main project title
  const t1 = Dt.Buildtitle();
  // test
  const g = 1;
  // Start with fully tagged dictionnary
  const fullTagDict = Dt.dictionnaryWithTag();
  console.log("dict with tag + reserved slot", fullTagDict);
  // Build dictionnary with IOList in place of tag list from tag list dictionnary build above
  const fullIoDict = Dt.dictionnaryWithIO(fullTagDict);
  console.log("Same like tag dict but with IOList", fullIoDict);
  //
  const GrpNumber = rawAbstract.Project.Option;
  for (let i = 0; i < GrpNumber; i++) {
    console.log(i + 1);
    for (const [key, value] of Object.entries(fullIoDict[i + 1])) {
      console.log(key, value);
      console.log(Tp.moduleBuilder(fullIoDict[i + 1][key]));
    }
  }
  // Variable declaration for architecture document only
  const conf = {
    // Size for image document header:
    width: 120,
    height: 110,
    title1: t1,
    text1: `Ce document décrit l'Architecture Materiel pour le projet ${t1}`,
    titleX: `${g}. Architecture GRP ${g}`,
    name: "Nicolas CHOMIER",
    mail: "nicolaschomier@dalkiaairsolutions.fr",
  };
  // ........................... //
  // DOCXJS ARCHITECTURE PATTERN //
  // ........................... //
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
          //wip
        ],
      },
    ],
  });

  /* Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "Architecture materiel.docx");
    console.log("Document created successfully");
  });  */
}
