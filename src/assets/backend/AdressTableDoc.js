import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType } from "docx";
import { Table } from "docx";
// Home made class importation
import {
  DataBuilder,
  DocxBuilder,
  Proface,
  AdressTableDocBuilder,
} from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_AdressTable(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["architecture"][tongue === 0 ? "uk" : "fr"];
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Atb = new AdressTableDocBuilder(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary, MASTER2 => tagList dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  const MASTER_TAG = Dt.tagListObject();
  const MASTER_ID = Dt.idListObject();
  // Get number of group
  const GrpNumber = rawAbstract.Project.Group;
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Function, variable and object which compose functional analysis
  const children = [];
  // Build a raw list with all important infos
  function buildRawArrayOfDatas(MASTER_IO, MASTER_TAG, MASTER_ID, flag) {
    const EmptyRawArray = [];
    const limit = ["module10", "module11", "module12"];
    for (let i = 1; i < GrpNumber + 1; i++) {
      for (const [key, value] of Object.entries(MASTER_IO[i])) {
        const idList = MASTER_ID[i][key];
        const tagList = MASTER_TAG[i][key];
        const partTitle = `${key}, grp${i}`;
        const isEmpty = !Object.values(value).some((x) => x !== 0);
        if (isEmpty !== true) {
          EmptyRawArray.push([partTitle]);
          const lineUp = Tp.moduleBuilder(value);
          let moduleNbs = 0;
          for (const [module, number] of Object.entries(lineUp)) {
            if (number !== 0 && limit.includes(module) === false) {
              moduleNbs += 1;
              const listWithTag = Atb.reshapeTagList(
                tagList,
                idList,
                module,
                flag,
                moduleNbs
              );
              EmptyRawArray.push(listWithTag);
            }
          }
        }
      }
    }
    return EmptyRawArray;
  }
  // Add bloc to document
  children.push(Dx.makeTitleRankOne(projectTitle)); // Main document title
  children.push(Dx.makeText()); // Space after title
  children.push(Dx.makeText(speak.text1)); // Document text introduction
  // Build the table wich will displayed with DOCXJS method & raw list above
  const _array = buildRawArrayOfDatas(MASTER_IO, MASTER_TAG, MASTER_ID, flag);
  for (const item of _array) {
    const _table = Dx.docxTable(item, 6);
    children.push(
      new Table({
        columnWidths: [600, 1200, 1000, 400, 1200, 800],
        rows: _table,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      })
    );
  }
  // AdressTable pattern
  const doc = new Document({
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
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
  return false;
}
