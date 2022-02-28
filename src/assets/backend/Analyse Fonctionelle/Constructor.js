// Class
import { MainDataCreator } from "../library/MotherDataCreator";
import { AFBuilder } from "../library/MainToolsBox";
import { DocxJsMethods } from "../library/DocxJsBuilder";
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
/**
 * Function which construct the AF document in word format
 * * Software architecture Version 2
 * * This function is called by "LastPage"
 * ? Should add "throw"expression ?
 * TODO Refactoring image function
 * @param rawAbstract = Datas from FRONT END
 * @param tongue = Printable language choosen by user
 * + fqfcqzfzq
 */
export function documentConstructorForAf(rawAbstract, country) {
  import(`./${country}-translations.json`)
    .catch(() => import("./uk-translations.json"))
    .then(({ core }) => {
      const translate = JSON.parse(JSON.stringify(core));
      const flag = country;
      // Class draft
      const Make = new MainDataCreator(rawAbstract);
      const Write = new DocxJsMethods(rawAbstract);
      const Get = new AFBuilder(rawAbstract);
      // Logic const declaration
      const tagIdObj = Make.projectTagsAndIdObject();
      const tagIdList = Make.projectTagsAndIdList();
      // Document const declaration
      const projectTitle = Make.projectTitle(true);
      const hmiRef = Get.choosenDeviceReference("HMI", true);
      const plcRef = Get.choosenDeviceReference("PLC", true);
      const hmiInfos = Get.editedDeviceInformations("HMI");
      const plcInfos = Get.editedDeviceInformations("PLC");
      const canInfos = Get.editedDeviceInformations("CAN");
      const csList = Make.specialProjectListFor("ConsumerName");
      const fbList = Make.specialProjectListFor("FunctionBloc");
      const tmaTable = Get.faultsTableOverviewFor(tagIdList, "TMA", flag);
      const tmiTable = Get.faultsTableOverviewFor(tagIdList, "TMI", flag);
      const pmaTable = Get.faultsTableOverviewFor(tagIdList, "PMA", flag);
      const pmiTable = Get.faultsTableOverviewFor(tagIdList, "PMI", flag);
      // Images
      function putImageOnDocument(imageName, child, w = 490, h = 290) {
        const img = new Paragraph({
          children: [
            new ImageRun({
              data: Buffer.from(imageName, "base64"),
              transformation: {
                width: w,
                height: h,
              },
            }),
          ],
        });
        child.push(img);
      }
      // Document Pattern
      const children = [];
      Write.documentTitle(translate.title1, children);
      Write.documentText(translate.text1, children, [projectTitle]);
      Write.documentTitle(translate.title2, children, 2);
      Write.documentText(translate.text2, children);
      Write.documentTable(translate.table2, children, [
        projectTitle,
        hmiRef,
        plcRef,
      ]);
      Write.documentTitle(translate.title3, children);
      Write.documentTitle(translate.subTitle3a, children, 2);
      Write.documentText(translate.text3a, children);
      Write.documentText(translate.text3aa, children);
      Write.documentList(hmiInfos, children);
      Write.documentList(plcInfos, children);
      Write.documentList(canInfos, children);
      Write.documentTitle(translate.subTitle3b, children, 2);
      Write.documentText(translate.text3b, children);
      Write.documentTitle(translate.smallTitle3b1, children, 3);
      Write.documentList(csList, children);
      Write.documentTitle(translate.smallTitle3b2, children, 3);
      Write.documentText("WIP", children);
      Write.documentTitle(translate.title4, children);
      Write.documentText(translate.text4, children, [projectTitle]);
      Write.documentTitle(translate.title5, children);
      Write.documentText(translate.text5, children, [projectTitle]);
      Write.documentTitle(translate.title6, children);
      Write.documentText(translate.text6A, children);
      Write.documentText(translate.text6B, children, [plcRef]);
      Write.documentText(translate.text6C, children);
      Write.documentTitle(translate.title7, children);
      Write.documentText(translate.text7, children, [hmiRef]);
      Write.documentTable(translate.table7, children);
      Write.documentTitle(translate.title8, children);
      Write.documentTable(translate.table8, children);
      Write.documentTitle(translate.title9, children);
      Write.documentTitle(translate.subTitle9A, children, 2);
      Write.documentTable(translate.table9A, children);
      Write.documentTitle(translate.smallTitle9A, children, 3);
      putImageOnDocument(ICC, children); // img
      Write.documentTitle(translate.subTitle9B, children, 2);
      Write.documentText(translate.text9B, children);
      Write.documentTitle(translate.smallTitle9B1, children, 3);
      putImageOnDocument(IRV, children, 100, 65); // img
      Write.documentTitle(translate.smallTitle9B2, children, 3);
      putImageOnDocument(IWV, children, 100, 65); // img
      Write.documentTitle(translate.subTitle9C, children, 2);
      Write.documentTable(translate.table9C, children);
      Write.documentTitle(translate.subTitle9D, children, 2);
      Write.documentTable(translate.table9D, children);
      Write.documentTitle(translate.smallTitle9D, children, 3);
      putImageOnDocument(IFTV, children); // img
      Write.documentText(translate.text9D, children);
      //* Function bloc chapter
      for (const bloc of fbList) {
        Write.documentTitle(translate[bloc].title1, children, 1, [bloc]);
        Write.documentTitle(translate[bloc].subTitle1, children, 2);
        Write.documentText(translate[bloc].text1, children);
        Write.documentTitle(translate[bloc].subTitle2, children, 2);
        Write.documentText(translate[bloc].text2, children, [bloc]);
        Write.documentList(translate[bloc].bulletList1, children);
        Write.documentTitle(translate[bloc].smallTilte1, children, 3);
        Write.documentTable(translate[bloc].table1, children);
        Write.documentTitle(translate[bloc].smallTilte2, children, 3, [bloc]);
        putImageOnDocument(IFB001, children, 550, 320); //! Ne regle pas le probleme de l'import pour d'autre FB
        Write.documentSpace(children);
        Write.documentTable(translate[bloc].table2, children);
      }
      Write.documentTitle(translate.title11, children);
      Write.documentText(translate.text11, children);
      //* Elements chapter
      for (const item of Object.keys(tagIdObj)) {
        Write.documentTitle(translate[item].title, children);
        Write.documentText(translate[item].infos, children);
        for (const [key, value] of Object.entries(tagIdObj[item])) {
          Write.documentTitle(translate[key].title, children, 2);
          Write.documentTitle(translate.subTitleA, children, 3);
          Write.documentText(translate[key]["A-infos"], children);
          Write.documentTitle(translate.subTitleB, children, 3);
          Write.documentText(translate[key]["B-intro"], children);
          Write.documentList(translate[key]["B-tags"], children);
          // c&c table
          Write.documentTitle(translate.subTitleC, children, 3);
          const ccMatrix = Get.controlAndCommandTable(value, flag);
          for (const table of ccMatrix) {
            Write.documentTable(table, children, [], "blue");
            Write.documentSpace(children);
          }
          // fault table
          Write.documentTitle(translate.subTitleD, children, 3);
          const ftMatrix = Get.faultTable(value, flag);
          for (const table of ftMatrix) {
            Write.documentTable(table, children, [], "orange");
            Write.documentSpace(children);
          }
        }
      }
      //* Chapter 18
      Write.documentTitle(translate.title18, children);
      Write.documentTitle(translate.subTitle18, children, 2);
      Write.documentText(translate.text18, children);
      Write.documentTitle(translate.smallTitle18A, children, 3);
      Write.documentText(translate.text18A, children);
      Write.documentTitle(translate.smallTitle18B, children, 3);
      Write.documentText(translate.text18B, children);
      Write.documentTitle(translate.subTitle18C, children, 2);
      Write.documentTable(tmaTable, children);
      Write.documentTitle(translate.subTitle18D, children, 2);
      Write.documentTable(tmiTable, children);
      Write.documentTitle(translate.subTitle18E, children, 2);
      Write.documentTable(pmaTable, children);
      Write.documentTitle(translate.subTitle18F, children, 2);
      Write.documentTable(pmiTable, children);
      Write.documentTitle(translate.title19, children);
      Write.documentText("WIP", children);
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
        saveAs(blob, `${translate.docName}-${projectTitle}.docx`);
      });
    });
  return false;
}
