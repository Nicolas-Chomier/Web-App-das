import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import { Document, ImageRun } from "docx";
import { Paragraph } from "docx";
// Home made class importation
import { DocxBuilder, Proface, AfDocBuilder } from "../tools/DocumentBuilder";
// Elements for document presentation
//import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooterAf";
// Images importation for AF document
import { IPLC } from "../image/image_af_plc";
import { IPLCLT4 } from "../image/image_af_plc_lt4000";
import { ICC } from "../image/image_af_colourCode";
import { IRV } from "../image/image_af_readingValue";
import { IWV } from "../image/image_af_writingValue";
import { IFTV } from "../image/image_af_hmiFault";
import { IFB001 } from "../image/image_af_fb001_screenView";
// External datas importation
import language from "../data/language/AF.json";

export function handleClick_AF(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const text = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  const speak = text[flag];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Afb = new AfDocBuilder(rawAbstract);
  // Variables
  const plcType = Afb.getHmiIo(rawAbstract.Project.Technology.id); // LT4000 or SP5000
  const projectTitle = Dx.buildTitle(); // Get project title
  const hmiRef = Afb.afGetHmiRef(); // Get hmi ref
  const plcRef = Afb.afGetPlcRef(); // Get plc ref
  // AF main list
  const children = [];
  // ---- Build CHAPTER 0 "Table of content" ---- //
  /*  const tableOfContent = Afb.tableOfContents();
  children.push(tableOfContent); */
  // ---- Build CHAPTER 1 "Document presentation" ---- //
  const title1 = Afb.makeAfTitleRankX(speak.title1, 1);
  const text1 = Afb.makeAfText(speak.text1 + projectTitle);
  children.push(title1, text1);
  // ---- Build CHAPTER 2 "Reference document" ---- //
  const title2 = Afb.makeAfTitleRankX(speak.title2, 1);
  const text2 = Afb.makeAfText(speak.text2);
  const table2 = Afb.makeAfTable(speak.table2, "classic", [
    projectTitle.toUpperCase(),
    hmiRef.toUpperCase(),
    plcRef.toUpperCase(),
  ]);
  children.push(title2, text2, table2);
  // ---- Build CHAPTER 3 "Installation architecture" ---- //
  const hmiNbs = rawAbstract.Project.Group;
  const hmiSeries = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "Series"
  );
  const title3 = Afb.makeAfTitleRankX(speak.title3, 1);
  const subTitle3a = Afb.makeAfTitleRankX(speak.subTitle3a, 2);
  const text3a = Afb.makeAfText(speak.text3a);
  const text3aa = Afb.makeAfText(speak.text3aa);
  children.push(title3, subTitle3a, text3a, text3aa);
  // Build bullet list for PLC part
  const plcInfos = Afb.afGetDeviceInfoChapter3("PLC");
  console.log("===========", plcInfos);
  const plcBullet = Afb.makeLevelAfBullet(plcInfos);
  for (const bullet of plcBullet) {
    children.push(bullet);
  }
  // Build bullet list for HMI part
  const hmiInfos = Afb.afGetDeviceInfoChapter3("HMI");
  const hmiBullet = Afb.makeLevelAfBullet(hmiInfos);
  for (const bullet of hmiBullet) {
    children.push(bullet);
  }
  // Build bullet list for CANOPEN MASTER part
  const canInfos = Afb.afGetDeviceInfoChapter3("CAN");
  const canBullet = Afb.makeLevelAfBullet(canInfos);
  for (const bullet of canBullet) {
    children.push(bullet);
  }
  const subTitle3b = Afb.makeAfTitleRankX(speak.subTitle3b, 2);
  const text3b = Afb.makeAfText(speak.text3b);
  const smallTitle3b1 = Afb.makeAfTitleRankX(speak.smallTitle3b1, 3);
  children.push(subTitle3b, text3b, smallTitle3b1);
  // Build element list
  const elemList = Afb.afGetElemListChapter3();
  const elemBullet = Afb.makeAfSimpleBullet(elemList);
  for (const bullet of elemBullet) {
    children.push(bullet);
  }
  const smallTitle3b2 = Afb.makeAfTitleRankX(speak.smallTitle3b2, 3);
  const textWip3 = Afb.makeAfText("NONE");
  children.push(smallTitle3b2, textWip3);
  // ---- Build CHAPTER 4 "Network architecture" ---- //
  const title4 = Afb.makeAfTitleRankX(speak.title4, 1);
  const rawtext4 = Dx.makeDocxjsCustomText(speak.text4, [
    projectTitle.toUpperCase(),
  ]);
  const text4 = Afb.makeAfText(rawtext4);
  children.push(title4, text4);
  // ---- Build CHAPTER 5 "Element listing" ---- //
  const title5 = Afb.makeAfTitleRankX(speak.title5, 1);
  const rawtext5 = Dx.makeDocxjsCustomText(speak.text5, [
    projectTitle.toUpperCase(),
  ]);
  const text5 = Afb.makeAfText(rawtext5);
  children.push(title5, text5);
  // ---- Build CHAPTER 6 "PLC settings" ---- //
  /* const nameRefDocPLC = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "PLC_documentation"
  ); */
  const rawtext6A = Dx.makeDocxjsCustomText(speak.text6A, [
    hmiNbs,
    hmiNbs,
    hmiSeries,
  ]);
  const image6 = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(plcType !== false ? IPLCLT4 : IPLC, "base64"),
        transformation: {
          width: 120,
          height: 120,
        },
      }),
    ],
  });
  const rawtext6B = Dx.makeDocxjsCustomText(speak.text6B, [plcRef]);
  const title6 = Afb.makeAfTitleRankX(speak.title6, 1);
  const text6A = Afb.makeAfText(rawtext6A);
  const text6B = Afb.makeAfText(rawtext6B);
  const text6C = Afb.makeAfText(speak.text6C);
  children.push(title6, text6A, image6, text6B, text6C);
  // ---- Build CHAPTER 7 "HMI settings" ---- //
  /* const nameRefDocHMI = Tp.giveMeHmiInformations(
    rawAbstract.Project.Technology.id,
    "HMI_documentation"
  ); */
  const rawText7 = Dx.makeDocxjsCustomText(speak.text7, [hmiRef]);
  const title7 = Afb.makeAfTitleRankX(speak.title7, 1);
  const text7 = Afb.makeAfText(rawText7);
  const table7 = Afb.makeAfTable(speak.table7);
  children.push(title7, text7, table7);
  // ---- Build CHAPTER 8 "Abbreviations" ---- //
  const title8 = Afb.makeAfTitleRankX(speak.title8, 1);
  const table8 = Afb.makeAfTable(speak.table8);
  children.push(title8, table8);
  // ---- Build CHAPTER 9 "Colour code" ---- //
  const title9 = Afb.makeAfTitleRankX(speak.title9, 1);
  const subTitle9A = Afb.makeAfTitleRankX(speak.subTitle9A, 2);
  const table9A = Afb.makeAfTable(speak.table9A);
  const smallTitle9A = Afb.makeAfTitleRankX(speak.smallTitle9A, 3);
  const image9A = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(ICC, "base64"),
        transformation: {
          width: 520,
          height: 450,
        },
      }),
    ],
  });
  const subTitle9B = Afb.makeAfTitleRankX(speak.subTitle9B, 2);
  const text9B = Afb.makeAfText(speak.text9B);
  const smallTitle9B1 = Afb.makeAfTitleRankX(speak.smallTitle9B1, 3);
  const image9B1 = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(IRV, "base64"),
        transformation: {
          width: 100,
          height: 65,
        },
      }),
    ],
  });
  const smallTitle9B2 = Afb.makeAfTitleRankX(speak.smallTitle9B2, 3);
  const image9B2 = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(IWV, "base64"),
        transformation: {
          width: 100,
          height: 65,
        },
      }),
    ],
  });
  const subTitle9C = Afb.makeAfTitleRankX(speak.subTitle9C, 2);
  const table9C = Afb.makeAfTable(speak.table9C);
  const subTitle9D = Afb.makeAfTitleRankX(speak.subTitle9D, 2);
  const table9D = Afb.makeAfTable(speak.table9D);
  const smallTitle9D = Afb.makeAfTitleRankX(speak.smallTitle9D, 3);
  const image9D = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(IFTV, "base64"),
        transformation: {
          width: 450,
          height: 400,
        },
      }),
    ],
  });
  const text9D = Afb.makeAfText(speak.text9D);
  children.push(
    title9,
    subTitle9A,
    table9A,
    smallTitle9A,
    image9A,
    subTitle9B,
    text9B,
    smallTitle9B1,
    image9B1,
    smallTitle9B2,
    image9B2,
    subTitle9C,
    table9C,
    subTitle9D,
    table9D,
    smallTitle9D,
    image9D,
    text9D
  );
  // ---- Build CHAPTER 10 "Function block description" ---- //
  const fbList = Afb.makeFunctionBlocList();
  for (const block of fbList) {
    const item = block.toUpperCase();
    const rawFbTitle1 = Dx.makeDocxjsCustomText(speak[item].title1, [item]);
    const fbTitle1 = Afb.makeAfTitleRankX(rawFbTitle1, 1);
    children.push(fbTitle1);
    const subtitle1 = Afb.makeAfTitleRankX(speak[item].subtitle1, 2);
    children.push(subtitle1);
    const text1 = Afb.makeAfText(speak[item].text1);
    children.push(text1);
    const subTitle2 = Afb.makeAfTitleRankX(speak[item].subTitle2, 2);
    children.push(subTitle2);
    const rawText2 = Dx.makeDocxjsCustomText(speak[item].text2, [item]);
    const text2 = Afb.makeAfText(rawText2);
    children.push(text2);
    const rawBulletList = speak[item].bulletList1;
    const bulletList1 = Afb.makeAfFbBullet(rawBulletList);
    for (const bullet of bulletList1) {
      children.push(bullet);
    }
    const smallTilte1 = Afb.makeAfTitleRankX(speak[item].smallTilte1, 3);
    children.push(smallTilte1);
    const table1 = Afb.makeAfTable(speak[item].table1);
    children.push(table1);
    const rawSmallTilte2 = Dx.makeDocxjsCustomText(speak[item].smallTilte2, [
      item,
    ]);
    const smallTilte2 = Afb.makeAfTitleRankX(rawSmallTilte2, 3);
    children.push(smallTilte2);
    const img1 = new Paragraph({
      children: [
        new ImageRun({
          data: Buffer.from(IFB001, "base64"),
          transformation: {
            width: 600,
            height: 350,
          },
        }),
      ],
    });
    children.push(img1);
    const table2 = Afb.makeAfTable(speak[item].table2);
    children.push(table2);
  }
  // ---- Build CHAPTER 11 "Operation of the installation" ---- //
  const title11 = Afb.makeAfTitleRankX(speak.title11, 1);
  const text11 = Afb.makeAfText(speak.text11);
  children.push(title11, text11);
  // ---- Build CHAPTER 12+ "Instrumentation + Process component + ..." ---- //
  const elementsMainObject = Afb.makeWorkingBasisObjectForAf();
  for (const item of Object.keys(elementsMainObject)) {
    // Push title rank 1
    children.push(Afb.makeAfTitleRankX(speak[item].title, 1));
    // Push main intro text
    if (speak[item].infos !== "") {
      children.push(Afb.makeAfText(speak[item].infos));
    }
    for (const key of Object.keys(elementsMainObject[item])) {
      // Variables
      const keyTupleList = elementsMainObject[item][key];
      const elemId = elementsMainObject[item][key][0][0];
      // Push sub title rank 2
      children.push(Afb.makeAfTitleRankX(speak[key].title, 2));
      // Push sub title rank 3 A
      children.push(Afb.makeAfTitleRankX(speak.subTitleA, 3));
      // Push element general information
      children.push(Afb.makeAfText(speak[key]["A-infos"]));
      // Push sub title rank 3 B
      children.push(Afb.makeAfTitleRankX(speak.subTitleB, 3));
      // Push intro part B
      children.push(Afb.makeAfText(speak[key]["B-intro"]));
      // Push tags bullet list in part B
      const bulletList = Afb.makeAfBullet(speak[key]["B-tags"]);
      for (const tag of bulletList) {
        children.push(tag);
      }
      // Push sub title rank 3 C
      children.push(Afb.makeAfTitleRankX(speak.subTitleC, 3));
      // Build control command table part C
      const firstRowC = speak["ccTableRow"];
      // Manage multi c&c table "BLUE"
      const managedByFbC = Afb.makeAfText(speak[key]["C-control&command"]);
      const matrixC = Afb.makeAfCustomTable(keyTupleList, firstRowC, flag);
      for (const table of matrixC) {
        children.push(
          Afb.checkFb(elemId) === false
            ? Afb.makeAfTable(table, "blue")
            : managedByFbC
        );
        children.push(Dx.makeText("", 0, 0));
      }
      // Push sub title rank 3 D
      children.push(Afb.makeAfTitleRankX(speak.subTitleD, 3));
      // Build faults table part D
      const firstRowD = speak["faultTableRow"];
      // Manage multi fault table "ORANGE"
      const managedByFbD = Afb.makeAfText(speak[key]["D-fault"]);
      const matrixD = Afb.makeAfFaultTable(keyTupleList, firstRowD, flag);
      const noFaultInsideTable = Afb.makeAfText("NONE");
      const space = Dx.makeText("", 0, 0);
      console.log(matrixD);
      if (matrixD.length === 0) {
        children.push(noFaultInsideTable);
      }
      for (const table of matrixD) {
        if (Afb.checkFb(elemId) === true) {
          children.push(managedByFbD);
        } else {
          const orangeTable = Afb.makeAfTable(table, "orange");
          children.push(orangeTable, space);
        }
      }
    }
  }
  // ---- Build CHAPTER 18- "Alarms management" ---- //
  const title18 = Afb.makeAfTitleRankX(speak.title18, 1);
  const subTitle18 = Afb.makeAfTitleRankX(speak.subTitle18, 2);
  const text18 = Afb.makeAfText(speak.text18);
  const smallTitle18A = Afb.makeAfTitleRankX(speak.smallTitle18A, 3);
  const text18A = Afb.makeAfText(speak.text18A);
  const smallTitle18B = Afb.makeAfTitleRankX(speak.smallTitle18B, 3);
  const text18B = Afb.makeAfText(speak.text18B);
  const subTitle18C = Afb.makeAfTitleRankX(speak.subTitle18C, 2);
  const table18C = Afb.makeAfTable(speak.table18C);
  const subTitle18D = Afb.makeAfTitleRankX(speak.subTitle18D, 2);
  const table18D = Afb.makeAfTable(speak.table18D);
  const subTitle18E = Afb.makeAfTitleRankX(speak.subTitle18E, 2);
  const table18E = Afb.makeAfTable(speak.table18E);
  const subTitle18F = Afb.makeAfTitleRankX(speak.subTitle18F, 2);
  const table18F = Afb.makeAfTable(speak.table18F);
  children.push(
    title18,
    subTitle18,
    text18,
    smallTitle18A,
    text18A,
    smallTitle18B,
    text18B,
    subTitle18C,
    table18C,
    subTitle18D,
    table18D,
    subTitle18E,
    table18E,
    subTitle18F,
    table18F
  );
  // ---- Build CHAPTER 19 "Security management" ---- //
  const title19 = Afb.makeAfTitleRankX(speak.title19, 1);
  children.push(title19);
  // Architecture pattern document
  //const styles = fs.readFileSync("./styles.xml", "utf-8");
  const doc = new Document({
    features: {
      updateFields: true,
    },
    sections: [
      {
        //headers: header,
        footers: footer,
        children: children,
      },
    ],
  });
  // Print document
  /* Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
  return false; */
}
