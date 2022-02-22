import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document } from "docx";
// Home made class importation
import {
  DataBuilder,
  DocxBuilder,
  Proface,
  IoDocBuilder,
} from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language/IO.json";

export function handleClick_IO(rawAbstract, tongue) {
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Iob = new IoDocBuilder(rawAbstract);
  // Main datas for document construction
  const rawMasterIo = Dt.addMandatorySlotTofullIolistProject();
  const masterIo = rawMasterIo["1"]; // DELETE le GRP
  const rawMasterTag = Dt.tagListObject();
  const masterTag = rawMasterTag["1"]; // DELETE le GRP
  const rawMasterId = Dt.idListObject();
  const masterId = rawMasterId["1"]; // DELETE le GRP
  // Variables for document construction
  const id = rawAbstract.Project.Technology.id;
  const projectTitle = Dx.buildTitle();
  const UselessModule = ["module10", "module11", "module12"];
  const native = Iob.getHmiIo(id);
  const HmiRef = Iob.getHmiRef(id);
  const EmptyRawArray = [];
  const children = [];
  // Document text language settings
  const text = JSON.parse(JSON.stringify(language));
  const flag = tongue === 0 ? "uk" : "fr"; // Get the flag
  const speak = text[flag];
  // Creation - Document main title
  const docTitle = Dx.makeTitleRankX(
    Dx.makeCustomText(speak.docTitle, [projectTitle]),
    1
  );
  children.push(docTitle);
  // Creation - Document introduction
  const intro = Dx.makeText(speak.docText);
  children.push(intro);
  // Creation - IOList
  if (native) {
    // Build LT4000 IOList
    const hmiTitle = Dx.makeTitleRankX(
      Dx.makeCustomText(speak.hmiTitle, [HmiRef]),
      2
    );
    children.push(hmiTitle);
    // Rest for IOList
    const ioList = Iob.substractIoList(masterIo, native);
    // Build substracted IOList in case of LT4000
    EmptyRawArray.push([`${HmiRef}`]);
    for (const [key, value] of Object.entries(native)) {
      const idList = masterId["MAIN"][key];
      const tagList = masterTag["MAIN"][key];
      const listWithTag = Iob.reshapeTagListSpecial(
        tagList,
        idList,
        key,
        value,
        flag,
        HmiRef
      );
      EmptyRawArray.push(listWithTag);
    }
    Dx.makeMainTable(EmptyRawArray, children);
    // Build LT4000 rest of IOList
    const plcTitle = Dx.makeTitleRankX(speak.plcTitle, 2);
    children.push(plcTitle);
    for (const [key, value] of Object.entries(ioList)) {
      const isEmpty = !Object.values(value).some((x) => x !== 0);
      if (isEmpty !== true) {
        const idList = masterId[key];
        const tagList = masterTag[key];
        const partTitle = `${key}`;
        EmptyRawArray.push([partTitle]);
        const lineUp = Tp.moduleBuilder(value);
        let moduleNbs = 0;
        for (const [module, number] of Object.entries(lineUp)) {
          if (number !== 0 && UselessModule.includes(module) === false) {
            for (let k = 0; k < number; k++) {
              moduleNbs += 1;
              const listWithTag = Iob.reshapeTagList(
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
    Dx.makeMainTable(EmptyRawArray, children);
  } else {
    for (const [key, value] of Object.entries(masterIo)) {
      const idList = masterId[key];
      const tagList = masterTag[key];
      const partTitle = `${key}`;
      EmptyRawArray.push([partTitle]);
      const lineUp = Tp.moduleBuilder(value);
      let moduleNbs = 0;
      for (const [module, number] of Object.entries(lineUp)) {
        if (number !== 0 && UselessModule.includes(module) === false) {
          for (let k = 0; k < number; k++) {
            moduleNbs += 1;
            const listWithTag = Iob.reshapeTagList(
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
    Dx.makeMainTable(EmptyRawArray, children);
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
