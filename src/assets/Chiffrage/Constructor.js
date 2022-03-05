// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { QTSBuilder } from "../library/MainToolsBox";
import { DocxJsMethods } from "../library/DocxJsBuilder";
import { Proface } from "../library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
import { header } from "../shared/js/DocumentHeader";
import { footer } from "../shared/js/DocumentFooter";
/**
 * Function which construct the QTS document in word format
 * * Software architecture Version 2
 * * This function is called by "LastPage"
 * ? Should add throw expression ?
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForQts(rawAbstract, country) {
  import(`./${country}-translations.json`)
    .catch(() => import("./uk-translations.json"))
    .then(({ core }) => {
      const translate = JSON.parse(JSON.stringify(core));
      // Class draft
      const Make = new MainDataCreator(rawAbstract);
      const Write = new DocxJsMethods(rawAbstract);
      const Get = new QTSBuilder(rawAbstract);
      const fromProviderDatas = new Proface(rawAbstract);
      // General & project const declaration
      const projectTitle = Make.projectTitle(true);
      const ioListing = Make.projectIoListing();
      // Provider const declaration
      const unique = fromProviderDatas.uniqueIoList(ioListing);
      const lineUp = fromProviderDatas.getModuleList(unique);
      // Document const declaration
      const table1 = Get.nomenclatureForHmi(translate.hmiTable);
      const table2 = Get.nomenclatureForModule(translate.moduleTable, lineUp);
      // Document Pattern
      const children = [];
      Write.documentTitle(projectTitle, children);
      Write.documentText(translate.text1, children);
      Write.documentTitle(translate.title2, children, 2);
      Write.documentTable(table1, children, "grey");
      Write.documentTitle(translate.title3, children, 2);
      Write.documentTable(table2, children, "grey");
      // Document
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
    });
  return false;
}
