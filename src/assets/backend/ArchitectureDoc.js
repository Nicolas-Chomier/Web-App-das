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
  Header,
  Paragraph,
  AlignmentType,
  ImageRun,
  TextRun,
} from "docx";

export function handleClick_Architecture(rawAbstract) {
  // Instantiation of the Document Tools class
  const Dt = new DataArrangement(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface(rawAbstract);
  // Instantiation of the document design class
  const Dx = new docxBuilder(rawAbstract);
  // Main project title
  const t1 = Dx.buildTitle();
  // Start with fully tagged dictionnary
  const fullTagDict = Dt.tagListObject();
  console.log("dict with tag + reserved slot", fullTagDict);
  // Build dictionnary with IOList in place of tag list from tag list dictionnary build above
  const fullIoDict = Dt.ioListObject(fullTagDict);
  console.log("Same like tag dict but with IOList", fullIoDict);
  // Variable declaration for architecture document only
  const conf = {
    // Size for image document header:
    width: 120,
    height: 110,
    title1: t1,
    text1: `Ce document décrit l'Architecture Materiel pour le projet ${t1}`,
    name: "Nicolas CHOMIER",
    mail: "nicolaschomier@dalkiaairsolutions.fr",
  };
  console.log("=====START=====");
  /////////////////
  // Children is the main list which contain all architecture
  const children = [];
  const GrpNumber = rawAbstract.Project.Group;
  for (let i = 1; i < GrpNumber + 1; i++) {
    // Creation for title rank 1
    const tr1 = Dx.titleRank1(i);
    children.push(tr1);
    for (const [key, value] of Object.entries(fullIoDict[i])) {
      // Check if IOList (value) is empty
      const isEmpty = !Object.values(value).some((x) => x !== 0);
      if (key === "MAIN") {
        if (isEmpty !== true) {
          // Create module line up from value (IOlist)
          const lineUp = Tp.lineUpBuilder(value);
          // Creation for title rank 2
          const tr2 = Dx.titleRank2(key, i);
          children.push(tr2);
          // Build many arrays looks like architecture
          for (const item of lineUp) {
            const array = Dx.makeTable(item);
            children.push(array);
            // Space after module row
            const space = Dx.makeRowSpace();
            children.push(space);
          }
        } else {
          // Push informative title when nothing inside group
          const noT = Dx.noTitle();
          children.push(noT);
        }
      } else {
        // Create module line up from value (IOlist)
        const lineUp = Tp.lineUpBuilder(value);
        // Creation for title rank 2
        const tr2 = Dx.titleRank2(key, i);
        children.push(tr2);
        // Build many arrays looks like architecture
        for (const item of lineUp) {
          const array = Dx.makeTable(item);
          children.push(array);
          // Space after module row
          const space = Dx.makeRowSpace();
          children.push(space);
        }
      }
    }
    children.push(Dx.makePagebreak());
  }
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
        children: children,
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "Architecture materiel.docx");
    console.log("Document created successfully");
  });
}
