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
export function documentConstructorForQts(rawAbstract, flag) {
  import(`./${flag}-translations.json`)
    .catch(() => import("./fr-translations.json"))
    .then(({ core }) => {
      const translate = JSON.parse(JSON.stringify(core));
      // Class draft
      const Make = new MainDataCreator(rawAbstract, flag);
      const Get = new QTSBuilder(rawAbstract, flag);
      const Write = new DocxJsMethods(rawAbstract);
      const fromProviderDatas = new Proface(rawAbstract);
      // General & project const declaration
      const projectTitle = Make.projectTitle(false);
      const ioListing = Make.projectIoListing();
      // Provider const declaration
      const elu = fromProviderDatas.dropEmptyLineUp();
      // Some logic
      for (const value of Object.values(ioListing)) {
        const lineUp = fromProviderDatas.getModuleList(value);
        elu.module1 += lineUp.module1;
        elu.module2 += lineUp.module2;
        elu.module3 += lineUp.module3;
        elu.module4 += lineUp.module4;
        elu.module5 += lineUp.module5;
        elu.module6 += lineUp.module6;
        elu.module7 += lineUp.module7;
        elu.module8 += lineUp.module8;
        elu.module9 += lineUp.module9;
        elu.module10 += lineUp.module10;
        elu.module11 += lineUp.module11;
        elu.module12 += lineUp.module12;
      }
      // Document const declaration
      const hmiTable = Get.nomenclatureForHmi(translate.hmiTable);
      const moduleTable = Get.nomenclatureForModule(translate.moduleTable, elu);
      // Document Pattern
      const children = [];
      Write.documentTitle(projectTitle, children);
      Write.documentText(translate.text1, children);
      Write.documentTitle(translate.title2, children, 2);
      Write.documentTable(hmiTable, children, "grey");
      Write.documentTitle(translate.title3, children, 2);
      Write.documentTable(moduleTable, children, "grey");
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
        saveAs(blob, `Chiffrage pour ${projectTitle}.docx`);
      });
    });
  return false;
}
