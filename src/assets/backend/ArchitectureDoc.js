import { Packer } from "docx";
import { saveAs } from "file-saver";
import { DataBuilder, Proface, DocxBuilder } from "../tools/DocumentBuilder";
import { Document } from "docx";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_Architecture(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["architecture"][tongue === 0 ? "uk" : "fr"];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary, MASTER2 => tagList dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  const MASTER_TAG = Dt.tagListObject();
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Sub function which will generate the entire architecture
  function buildEntireArchitecture() {
    const children = [];
    const GrpNumber = rawAbstract.Project.Group;
    for (let i = 1; i < GrpNumber + 1; i++) {
      // Creation for title rank 1
      const title1 = Dx.titleRank1(i);
      children.push(title1);
      for (const [key, value] of Object.entries(MASTER_IO[i])) {
        // Check if IOList (value) is empty
        const isEmpty = !Object.values(value).some((x) => x !== 0);
        if (isEmpty !== true) {
          // Get tag list from tag dictionnary
          const tagList = MASTER_TAG[i][key];
          // Create module line up from value (IOlist)
          const lineUp = Tp.lineUpBuilder(value);
          // Creation for title rank 2
          const title2 = Dx.titleRank2(key, i);
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
      children.push(Dx.makePagebreak());
    }
    return children;
  }
  // Architecture pattern document
  const doc = new Document({
    sections: [
      {
        headers: header,
        footers: footer,
        children: buildEntireArchitecture(),
      },
    ],
  });
  // Print document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
  return false;
}
