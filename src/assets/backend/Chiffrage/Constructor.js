// Class
import { MainDataCreator } from "../Library/MotherDataCreator";
import { QTSBuilder } from "../Library/MainToolsBox";
import { DocxJsMethods } from "../Library/DocxJsBuilder";
import { Proface } from "../Library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooter";
// Contents
import language from "./traduction.json";

const traductionJson = JSON.parse(JSON.stringify(language));
/**
 * Function which construct the QTS document in word format
 * * Software architecture Version 2
 * ! Attention : Logic to determine language will be changed soon !
 * ? Should add throw expression ?
 * * This function is called by "LastPage"
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForQts(rawAbstract, tongue) {
  const flag = !tongue ? "uk" : "fr";
  const speak = traductionJson[flag];
  // Class draft
  const Make = new MainDataCreator(rawAbstract);
  const Write = new DocxJsMethods(rawAbstract);
  const Get = new QTSBuilder(rawAbstract);
  const fromProviderDatas = new Proface(rawAbstract);
  // Logic const declaration
  const plcNative = Get.plcNativeIoList();
  const pml = Make.projectMainObjIoList(plcNative);
  const unique = Get.uniqueIoList(pml);
  const lineUp = fromProviderDatas.getModuleList(unique);
  // Document const declaration
  const projectTitle = Make.projectTitle(true);
  const table1 = Get.nomenclatureForHmi(speak.hmiTable);
  const table2 = Get.nomenclatureForModule(speak.moduleTable, lineUp);
  // Document Pattern
  const children = [];
  Write.documentTitle(projectTitle, children);
  Write.documentText(speak.text1, children);
  Write.documentTitle(speak.title2, children, 2);
  Write.documentTable(table1, children, "grey");
  Write.documentTitle(speak.title3, children, 2);
  Write.documentTable(table2, children, "grey");
  const document = new Document({
    sections: [
      {
        headers: header,
        footers: footer,
        children: children,
      },
    ],
  });
  // Print document
  Packer.toBlob(document).then((blob) => {
    saveAs(blob, `${projectTitle}-CHIFFRAGE.docx`);
  });
  return false;
}
