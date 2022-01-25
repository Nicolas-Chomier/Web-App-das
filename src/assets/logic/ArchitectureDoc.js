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
  const Dx = new docxBuilder();
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
  console.log("=====START=====");
  /////////////////
  /*   // test de test method
  const moduleExample = {
    module1: 0,
    module2: 1,
    module3: 1,
    module4: 7,
    module5: 1,
    module6: 1,
    module7: 7,
    module8: 1,
    module9: 0,
    module10: 1,
    module11: 0,
    module12: 0,
  };
  const testA = Tp.designModuleLine(moduleExample);
  console.log("designModuleLine", testA);
  //
  const testB = Tp.splitModuleLine(testA);
  console.log("splitModuleLine", testB);
  //
  const testC = Tp.orderedModuleLine(testB);
  console.log("orderedModuleLine", testC); */
  const children = [];
  const GrpNumber = rawAbstract.Project.Option;
  for (let i = 1; i < GrpNumber + 1; i++) {
    // Creation for title rank 1
    console.log("creation d'un titre de rang 1 pour annoncer le group:", i);
    const tr1 = Dx.titleRank1(i);
    children.push(tr1);
    for (const [key, value] of Object.entries(fullIoDict[i])) {
      // Check if IOList (value) is empty
      const isEmpty = !Object.values(value).some((x) => x !== 0);

      if (key === "MAIN") {
        if (isEmpty !== true) {
          // Creation for title rank 2
          console.log(
            "creation d'un titre de rang 2 pour annoncer la MAIN module line up du groupe ci dessus"
          );
          const tr2 = Dx.titleRank2(key, i);
          children.push(tr2);
          // Create module line up from value which are IOlist
          const lineUp = Tp.lineUpBuilder(value);
          console.log(lineUp);
          // Build many arrays
          for (const item of lineUp) {
            console.log(item, "item");
            const array = Dx.tableShapeArchitecture(item);
            children.push(array);
          }
        } else {
          // Push informative title when nothing inside group
          const noT = Dx.noTitle();
          children.push(noT);
        }
      } else {
        // Creation for title rank 2
        console.log(
          `creation d'un titre de rang 2 pour annoncer la module line up du compresseur ${key}`
        );
        const tr2 = Dx.titleRank2(key, i);
        children.push(tr2);
        // Module line up
        const lineUp = Tp.lineUpBuilder(value);
        console.log(lineUp);
      }
    }
  }

  //
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
