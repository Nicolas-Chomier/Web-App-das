// Class
import { MainDataCreator } from "../Library/MotherDataCreator";
import { AFBuilder } from "../Library/MainToolsBox";
import { DocxJsMethods } from "../Library/DocxJsBuilder";
//import { Proface } from "../Library/Proface";
// DocxJs
import { Packer, Document, ImageRun, Paragraph } from "docx";
import { Buffer } from "buffer";
import { saveAs } from "file-saver";
// Datas & Images
import { ICC } from "../../image/image_af_colourCode";
import { IRV } from "../../image/image_af_readingValue";
import { IWV } from "../../image/image_af_writingValue";
import { IFTV } from "../../image/image_af_hmiFault";
import { IFB001 } from "../../image/image_af_fb001_screenView";
//import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooterAf";
// Contents
import language from "./Traduction.json";

const traductionJson = JSON.parse(JSON.stringify(language));
/**
 * Function which construct the AF document in word format
 * * Software architecture Version 2
 * * This function is called by "LastPage"
 * ! Attention : Logic to determine language will be changed soon !
 * ? Should add throw expression ?
 * TODO Refactoring image function
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForAf(rawAbstract, tongue) {
  const flag = !tongue ? "uk" : "fr";
  const speak = traductionJson[flag];
  // Class draft
  const Make = new MainDataCreator(rawAbstract);
  const Write = new DocxJsMethods(rawAbstract);
  const Get = new AFBuilder(rawAbstract);
  //const fromProviderDatas = new Proface(rawAbstract);
  // Logic const declaration

  // Document const declaration
  const projectTitle = Make.projectTitle(true);
  //const native = Get.nativeDeviceInfos();
  const hmiRef = Get.choosenDeviceReference("HMI", true);
  const plcRef = Get.choosenDeviceReference("PLC", true);
  const hmiInfos = Get.editedDeviceInformations("HMI");
  const plcInfos = Get.editedDeviceInformations("PLC");
  const canInfos = Get.editedDeviceInformations("CAN");
  const csList = Make.specialProjectListFor("ConsumerName");
  const fbList = Make.specialProjectListFor("FunctionBloc");
  const tagIdObj = Make.projectTagsAndIdObject();
  // Document Pattern
  const children = [];
  Write.documentTitle(speak.title1, children);
  Write.documentText(speak.text1, children, [projectTitle]);
  Write.documentTitle(speak.title2, children, 2);
  Write.documentText(speak.text2, children);
  Write.documentTable(speak.table2, children, "grey", [
    projectTitle,
    hmiRef,
    plcRef,
  ]);
  Write.documentTitle(speak.title3, children);
  Write.documentTitle(speak.subTitle3a, children, 2);
  Write.documentText(speak.text3a, children);
  Write.documentText(speak.text3aa, children);
  Write.documentList(hmiInfos, children);
  Write.documentList(plcInfos, children);
  Write.documentList(canInfos, children);
  Write.documentTitle(speak.subTitle3b, children, 2);
  Write.documentText(speak.text3b, children);
  Write.documentTitle(speak.smallTitle3b1, children, 3);
  Write.documentList(csList, children);
  Write.documentTitle(speak.smallTitle3b2, children, 3);
  Write.documentText("WIP", children);
  Write.documentTitle(speak.title4, children);
  Write.documentText(speak.text4, children, [projectTitle]);
  Write.documentTitle(speak.title5, children);
  Write.documentText(speak.text5, children, [projectTitle]);
  Write.documentTitle(speak.title6, children);
  Write.documentText(speak.text6A, children);
  Write.documentText(speak.text6B, children, [plcRef]);
  Write.documentText(speak.text6C, children);
  Write.documentTitle(speak.title7, children);
  Write.documentText(speak.text7, children, [hmiRef]);
  Write.documentTable(speak.table7, children);
  Write.documentTitle(speak.title8, children);
  Write.documentTable(speak.table8, children);
  Write.documentTitle(speak.title9, children);
  Write.documentTitle(speak.subTitle9A, children, 2);
  Write.documentTable(speak.table9A, children);
  Write.documentTitle(speak.smallTitle9A, children, 3);
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
  children.push(image9A);
  Write.documentTitle(speak.subTitle9B, children, 2);
  Write.documentText(speak.text9B, children);
  Write.documentTitle(speak.smallTitle9B1, children, 3);
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
  children.push(image9B1);
  Write.documentTitle(speak.smallTitle9B2, children, 3);
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
  children.push(image9B2);
  Write.documentTitle(speak.subTitle9C, children, 2);
  Write.documentTable(speak.table9C, children);
  Write.documentTitle(speak.subTitle9D, children, 2);
  Write.documentTable(speak.table9D, children);
  Write.documentTitle(speak.smallTitle9D, children, 3);
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
  children.push(image9D);
  Write.documentText(speak.text9D, children);
  /** */
  for (const bloc of fbList) {
    Write.documentTitle(speak[bloc].title1, children, 1, [bloc]);
    Write.documentTitle(speak[bloc].subTitle1, children, 2);
    Write.documentText(speak[bloc].text1, children);
    Write.documentTitle(speak[bloc].subTitle2, children, 2);
    Write.documentText(speak[bloc].text2, children, [bloc]);
    Write.documentList(speak[bloc].bulletList1, children);
    Write.documentTitle(speak[bloc].smallTilte1, children, 3);
    Write.documentTable(speak[bloc].table1, children);
    Write.documentTitle(speak[bloc].smallTilte2, children, 3, [bloc]);
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
    Write.documentTable(speak[bloc].table2, children);
  }
  Write.documentTitle(speak.title11, children);
  Write.documentText(speak.text11, children);
  /** */
  for (const item of Object.keys(tagIdObj)) {
    Write.documentTitle(speak[item].title, children);
    Write.documentText(speak[item].infos, children);
    for (const [key, value] of Object.entries(tagIdObj[item])) {
      Write.documentTitle(speak[key].title, children, 2);
      Write.documentTitle(speak.subTitleA, children, 3);
      Write.documentText(speak[key]["A-infos"], children);
      Write.documentTitle(speak.subTitleB, children, 3);
      Write.documentText(speak[key]["B-intro"], children);
      Write.documentList(speak[key]["B-tags"], children);
      // c&c table
      Write.documentTitle(speak.subTitleC, children, 3);
      const ccMatrix = Get.controlAndCommandTable(value, flag);
      for (const table of ccMatrix) {
        Write.documentTable(table, children, "blue");
        Write.documentSpace(children);
      }
      // fault table
      Write.documentTitle(speak.subTitleD, children, 3);
      const ftMatrix = Get.faultTable(value, flag);
      for (const table of ftMatrix) {
        Write.documentTable(table, children, "orange");
        Write.documentSpace(children);
      }
    }
  }
  Write.documentTitle(speak.title18, children);
  Write.documentTitle(speak.subTitle18, children, 2);
  Write.documentText(speak.text18, children);
  Write.documentTitle(speak.smallTitle18A, children, 3);
  Write.documentText(speak.text18A, children);
  Write.documentTitle(speak.smallTitle18B, children, 3);
  Write.documentText(speak.text18B, children);
  Write.documentTitle(speak.subTitle18C, children, 2);
  Write.documentTable(speak.table18C, children);
  Write.documentTitle(speak.subTitle18D, children, 2);
  Write.documentTable(speak.table18D, children);
  Write.documentTitle(speak.subTitle18E, children, 2);
  Write.documentTable(speak.table18E, children);
  Write.documentTitle(speak.subTitle18F, children, 2);
  Write.documentTable(speak.table18F, children);
  Write.documentTitle(speak.title19, children);
  Write.documentText("WIP", children);
  // ...
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
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
  return false;
}
