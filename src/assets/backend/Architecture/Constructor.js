// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { ARCHBuilder } from "../library/MainToolsBox";
import { DocxJsMethods } from "../library/DocxJsBuilder";
import { Proface } from "../library/Proface";
// DocxJs
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
// Datas & Images
import { LT4 } from "./images/image_arch_LT4000";
import { SP5 } from "./images/image_arch_SP5000";
import { IM1 } from "./images/image_module_pf_1";
import { IM2 } from "./images/image_module_pf_2";
import { IM3 } from "./images/image_module_pf_3";
import { IM4 } from "./images/image_module_pf_4";
import { IM5 } from "./images/image_module_pf_5";
import { IM6 } from "./images/image_module_pf_6";
import { IM7 } from "./images/image_module_pf_7";
// Datas
import { header } from "../shared/DocumentHeader";
import { footer } from "../shared/DocumentFooterAf";
/**
 * Function which construct the ARCH document in word format
 * * Software architecture Version 2
 * * This function is called by "LastPage"
 * ? Should add "throw"expression ?
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 */
export function documentConstructorForArchitecture(rawAbstract, country) {
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
      const bool = Make.nativeDeviceInfos();
      // Document const declaration
      const imgListing = [IM1, IM1, IM2, IM3, IM4, IM5, IM6, IM7];
      // Document Pattern
      const children = [];
      Write.documentTitle(translate.docTitle, children, 1, [projectTitle]);
      Write.documentTitle(translate.hmiTitle, children, 2, [hmiRef]);
      Write.documentText(translate.hmiText, children);
      Write.documentImage(bool ? LT4 : SP5, children, 350, 250); // img
      Write.documentTitle(translate.plcTitle, children, 2, [projectTitle]);
      Write.documentText(translate.plcText, children);
      // Document construction design
      if (bool) {
        const nativeTable = Get.nativeArchitectureTable(tagListing, plcRef);
        Write.documentTitle(translate.subTitle, children, 3, [plcRef]);
        Write.documentTable(nativeTable, children, [], "grey", "multiColor");
        for (const [key, value] of Object.entries(ioListing)) {
          Write.documentTitle(translate.subTitle, children, 3, [key], true);
          console.log(value); //! Bug si lineup vide
          const lineUp = fromProviderDatas.GetlineUp(value); // Provider const declaration
          for (const item of lineUp) {
            Get.drawedTable(item, children, tagListing[key], imgListing);
            Write.documentSpace(children);
          }
        }
      } else {
        for (const [key, value] of Object.entries(ioListing)) {
          Write.documentTitle(translate.subTitle, children, 3, [key]);
          const lineUp = fromProviderDatas.GetlineUp(value); // Provider const declaration
          for (const item of lineUp) {
            Get.drawedTable(item, children, tagListing[key], imgListing);
            Write.documentSpace(children);
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
        saveAs(blob, `${translate.docName}-${projectTitle}.docx`);
      });
    });
  return false;
}
