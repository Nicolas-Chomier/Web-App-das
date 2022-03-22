// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { IOLISTBuilder } from "../library/MainToolsBox";
import { DocxJsMethods } from "../library/DocxJsBuilder";
import { Proface } from "../library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
import { header } from "../shared/js/DocumentHeader";
import { footer } from "../shared/js/DocumentFooterAf";
/**
 * Function which construct the IOList document in word format
 * * Software architecture Version 2
 * + This function is called by "LastPage"
 * ? Should add "throw"expression ?
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForIOList(rawAbstract, flag) {
  import(`./${flag}-translations.json`)
    .catch(() => import("./uk-translations.json"))
    .then(({ core }) => {
      const translate = JSON.parse(JSON.stringify(core));
      // Class draft
      const Make = new MainDataCreator(rawAbstract, flag);
      const Get = new IOLISTBuilder(rawAbstract, flag);
      const Write = new DocxJsMethods(rawAbstract);
      const fromProviderDatas = new Proface(rawAbstract);
      // General & project const declaration
      const projectTitle = Make.projectTitle(true);
      const hmiRef = Make.deviceReferenceFor("HMI", true);
      const tagListing = Make.projectListingfor("TAG");
      const idListing = Make.projectListingfor("ID");
      const ioListing = Make.projectIoListing();
      // Provider const declaration
      const UselessModule = fromProviderDatas.dropNoModule();
      // Document const declaration
      const natIo = Get.nativePlcIo();
      const firstRow = translate.firstRow;
      let byPass = false;
      // Document Pattern
      const children = [];
      Write.documentTitle(translate.docTitle, children, 1, [projectTitle]);
      Write.documentText(translate.docText, children, [projectTitle]);
      for (const [type, object] of Object.entries(ioListing)) {
        Write.documentTitle(type.toUpperCase(), children, 3, [], byPass);
        if (natIo && !byPass) {
          byPass = true;
          for (const [key, value] of Object.entries(natIo)) {
            const idList = idListing[type][key]; //! a factoriser
            const tagList = tagListing[type][key]; //! a factoriser
            const listWithTag = Get.ioListTableForPlc(
              idList,
              tagList,
              key,
              value,
              hmiRef,
              firstRow,
              flag
            );
            Write.documentTable(listWithTag, children, [], "gold");
            Write.documentSpace(children);
          }
        }
        const idList2 = idListing[type];
        const tagList2 = tagListing[type];
        // Boucle a travers la line up de module
        const lineUp = fromProviderDatas.getModuleList(object);
        let moduleNbs = 0;
        for (const [module, number] of Object.entries(lineUp)) {
          if (number !== 0 && UselessModule.includes(module) === false) {
            for (let k = 0; k < number; k++) {
              moduleNbs += 1;
              const test = Get.ioListTableForLineUp(
                idList2,
                tagList2,
                module,
                moduleNbs,
                firstRow,
                flag
              );
              Write.documentTable(test, children, [], "blue");
            }
          }
        }
      }
      // Document
      const doc = new Document({
        features: {
          updateFields: true,
        },
        sections: [
          {
            headers: header,
            footers: footer,
            children: children,
          },
        ],
      });
      // Print document
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${projectTitle} - IOList - V1.docx`);
      });
    });
}
