// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { IOLISTBuilder } from "../library/MainToolsBox";
import { DocxJsMethods } from "../library/DocxJsBuilder";
import { Proface } from "../library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas
import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooterAf";
/**
 * Function which construct the IOList document in word format
 * * Software architecture Version 2
 * * This function is called by "LastPage"
 * ? Should add "throw"expression ?
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForIOList(rawAbstract, country) {
  import(`./${country}-translations.json`)
    .catch(() => import("./uk-translations.json"))
    .then(({ core }) => {
      const translate = JSON.parse(JSON.stringify(core));
      const flag = country;

      // Class draft
      const Make = new MainDataCreator(rawAbstract);
      const Write = new DocxJsMethods(rawAbstract);
      const Get = new IOLISTBuilder(rawAbstract);
      const fromProviderDatas = new Proface(rawAbstract);
      // General & project const declaration
      const projectTitle = Make.projectTitle(true);
      const hmiRef = Make.deviceReferenceFor("HMI", true);
      const plcRef = Make.deviceReferenceFor("PLC", true);
      const tagListing = Make.projectListingfor("TAG");
      const idListing = Make.projectListingfor("ID");
      const ioListing = Make.projectIoListing();
      const EmptyRawArray = [];
      // Document const declaration
      const natIo = Get.nativePlcIo();
      console.log(natIo);
      const firstRow = translate.firstRow;

      const children = [];
      Write.documentTitle(translate.docTitle, children, 1, [projectTitle]);
      Write.documentText(translate.docText, children, [projectTitle]);
      //! test
      console.log("tagListing", tagListing);
      console.log("idListing", idListing);
      console.log("ioListing", ioListing);

      if (natIo) {
        for (const [key, value] of Object.entries(natIo)) {
          console.log("===============", natIo);
          const idList = idListing["MAIN"][key];
          console.log("idList", idList);
          const tagList = tagListing["MAIN"][key];
          console.log("tagList", tagList);
          const listWithTag = Get.reshapeTagListSpecial(
            idList,
            tagList,
            key,
            value,
            hmiRef,
            firstRow,
            flag
          );

          EmptyRawArray.push(listWithTag);
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
      console.log("iolist ok");
      // Print document
      /* Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${translate.docName}-${projectTitle}.docx`);
      }); */
    });
}
