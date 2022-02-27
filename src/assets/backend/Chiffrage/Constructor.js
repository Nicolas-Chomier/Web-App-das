// Class
import { DocxJsMethods } from "../Library/DocxJsBuilder";
import { DataSetBuilder } from "../Library/MainDataSetBuilder";
import { QTSBuilder } from "../Library/MainToolsBox";
import { Proface } from "../Library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooter";
import language from "./traduction.json";

const traductionJson = JSON.parse(JSON.stringify(language));
/** */
export function handleClick_QTS(rawAbstract, tongue) {
  const flag = !tongue ? "uk" : "fr";
  const speak = traductionJson[flag];
  // Class draft
  const Write = new DocxJsMethods(rawAbstract);
  const Make = new DataSetBuilder(rawAbstract);
  const Get = new QTSBuilder(rawAbstract);
  const fromProfaceDatas = new Proface(rawAbstract);
  // Logic const declaration
  const plcNative = Get.plcNativeIoList();
  const pml = Make.projectMainObjIoList(plcNative);
  const unique = Get.uniqueIoList(pml);
  const lineUp = fromProfaceDatas.getModuleList(unique);
  // Document const declaration
  const projectTitle = Write.projectTitle(true);
  const table1 = Get.nomenclatureForHmi(speak.hmiTable);
  const table2 = Get.nomenclatureForModule(speak.moduleTable, lineUp);
  // Document Pattern
  const children = [];
  Write.documentTitle(projectTitle, children, 1);
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
