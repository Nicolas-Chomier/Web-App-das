// Class
import { MainDataCreator } from "../Library/MotherDataCreator";
import { AFBuilder } from "../Library/MainToolsBox";
import { DocxJsMethods } from "../Library/DocxJsBuilder";
//import { Proface } from "../Library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
//import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooterAf";
// Contents
import language from "./Traduction.json";

const traductionJson = JSON.parse(JSON.stringify(language));
/**
 * Function which construct the AF document in word format
 * * Software architecture Version 2
 * ! Attention : Logic to determine language will be changed soon !
 * ? Should add throw expression ?
 * * This function is called by "LastPage"
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
  const csList = Make.projectConsumerList(true);
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
  // ---- Build CHAPTER 6 "PLC settings" ---- //
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
