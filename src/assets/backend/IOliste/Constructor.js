// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { ARCHBuilder } from "../library/MainToolsBox";
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
      // Class draft
      const Make = new MainDataCreator(rawAbstract);
      const Write = new DocxJsMethods(rawAbstract);
      const Get = new ARCHBuilder(rawAbstract);
      const fromProviderDatas = new Proface(rawAbstract);
      // General & project const declaration
      const projectTitle = Make.projectTitle(true);
      const hmiRef = Make.deviceReferenceFor("HMI", true);
      const plcRef = Make.deviceReferenceFor("PLC", true);
      const tagListing = Make.projectListingfor("TAG");
      const ioListing = Make.projectIoListing();
      // Document const declaration
      const children = [];
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
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${translate.docName}-${projectTitle}.docx`);
      });
    });
}
