import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import {
  DataBuilder,
  Proface,
  DocxBuilder,
  ArchDocBuilder,
} from "../tools/DocumentBuilder";
import { Document, Paragraph, ImageRun } from "docx";
// Images importation for AF document
import { LT4 } from "../image/image_arch_LT4000";
import { SP5 } from "../image/image_arch_SP5000";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language/ARCH.json";

export function handleClick_ARCH(rawAbstract, tongue) {
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  const Ar = new ArchDocBuilder(rawAbstract);
  // Main datas for document construction
  const rawMasterIo = Dt.addMandatorySlotTofullIolistProject();
  const masterIo = rawMasterIo["1"]; // DELETE le GRP
  const rawMasterTag = Dt.tagListObject();
  const masterTag = rawMasterTag["1"]; // DELETE le GRP
  // Variables for document construction
  const id = rawAbstract.Project.Technology.id;
  const projectTitle = Dx.buildTitle();
  const imageCatalog = { LT4000: LT4, SP5000: SP5 };
  const native = Ar.getHmiIo(id);
  const HmiRef = Ar.getHmiRef(id);
  const HmiImage = Ar.getHmiImg(id);
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
  // Creation - HMI part
  const hmiTitle = Dx.makeTitleRankX(
    Dx.makeCustomText(speak.hmiTitle, [HmiRef]),
    2
  );
  const hmiIntro = Dx.makeText(speak.hmiText);
  const hmiImage = new Paragraph({
    children: [
      new ImageRun({
        data: Buffer.from(imageCatalog[HmiImage], "base64"),
        transformation: {
          width: 400,
          height: 300,
        },
      }),
    ],
  });
  children.push(hmiTitle, hmiIntro, hmiImage);
  // Creation - PLC part, Title & Intro
  const break1 = Dx.makePagebreak();
  const plcTitle = Dx.makeTitleRankX(
    Dx.makeCustomText(speak.plcTitle, [projectTitle]),
    2
  );
  const plcIntro = Dx.makeText(speak.plcText);
  children.push(break1, plcTitle, plcIntro);
  // Creation - PLC part, structure builded by many array with board image and list of tags ...
  console.log("masterIo", masterIo);
  console.log("masterTag", masterTag);
  console.log("native", native);

  if (native) {
    // Build LT4000 Architecture
    const plcSubTitle = Dx.makeTitleRankX(
      Dx.makeCustomText(speak.subTitle, [HmiRef]),
      3
    );
    children.push(plcSubTitle);
    // Build substracted IOList in case of LT4000
    const ioList = Ar.substractIoList(masterIo, native);
    const array = Ar.makeTable(native, masterTag); //!
    children.push(array);
    const space = Dx.makeText(); // Space after module row
    children.push(space);
    for (const [key, value] of Object.entries(ioList)) {
      console.log(key, value);
      const plcSubTitle = Dx.makeTitleRankX(
        Dx.makeCustomText(speak.subTitle, [key]),
        3
      );
      children.push(plcSubTitle);
      // Get tag list from tag dictionnary
      const tagList = masterTag[key];
      const lineUp = Tp.lineUpBuilder(value);
      for (const item of lineUp) {
        console.log(item);
        const array = Dx.makeTable(item, tagList); //!
        children.push(array);
        const space = Dx.makeText(); // Space after module row
        children.push(space);
      }
    }
  } else {
    for (const [key, value] of Object.entries(masterIo)) {
      console.log(key, value);
      const plcSubTitle = Dx.makeTitleRankX(
        Dx.makeCustomText(speak.subTitle, [key]),
        3
      );
      children.push(plcSubTitle);
      // Get tag list from tag dictionnary
      const tagList = masterTag[key];
      const lineUp = Tp.lineUpBuilder(value);
      for (const item of lineUp) {
        console.log(item);
        const array = Dx.makeTable(item, tagList); //!
        children.push(array);
        const space = Dx.makeText(); // Space after module row
        children.push(space);
      }
    }
  }

  //const testt = Ar.substractIoList(MASTER_IO, nativIo);

  /* for (const [key, value] of Object.entries(masterIo)) {
    console.log(key, value);
    // Check if IOList (value) is empty
    const isEmpty = !Object.values(value).some((x) => x !== 0);
    if (isEmpty !== true) {
      // Get tag list from tag dictionnary
      const tagList = masterTag[key];
      // Create module line up from value (IOlist)
      const lineUp = Tp.lineUpBuilder(value);
      // Creation for title rank 2
      const title2 = Dx.titleRank2(key);
      children.push(title2);
      // Build many arrays looks like architecture
      for (const item of lineUp) {
        const array = Dx.makeTable(item, tagList); //!
        children.push(array);
        const space = Dx.makeText(); // Space after module row
        children.push(space);
      }
    } else {
      // Push informative title when nothing inside group
      const noT = Dx.noTitle();
      children.push(noT);
    }
  }
  children.push(Dx.makePagebreak()); */

  // Architecture pattern document
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
