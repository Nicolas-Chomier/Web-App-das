import { Packer } from "docx";
import { saveAs } from "file-saver";
import { DataBuilder, Proface, docxBuilder } from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/documentHeader";
import { footer } from "../tools/DocumentFooter";
import { Document } from "docx";

export function handleClick_Architecture(rawAbstract, flag) {
  // Instantiation of the Document Tools class
  const Dt = new DataBuilder(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface(rawAbstract);
  // Instantiation of the document design class
  const Dx = new docxBuilder(rawAbstract);
  // Main project title
  const documentTitle = Dx.buildTitle();
  // Start with fully tagged dictionnary
  const fullTagDict = Dt.tagListObject();
  // Build the same but with IOList in place of tags
  const fullIoDict = Dt.addMandatorySlotTofullIolistProject();
  // Variable declaration for quotation document only in FR and UK
  const conf = {
    uk: {
      text1: `This document describe the material architecture for ${documentTitle} project`,
      docName: "Architecture",
    },
    fr: {
      text1: `Ce document décrit l'Architecture Materiel pour le projet ${documentTitle}`,
      docName: "Architecture",
    },
  };
  // Children is the main list which contain all architecture
  const children = [];
  const GrpNumber = rawAbstract.Project.Group;
  for (let i = 1; i < GrpNumber + 1; i++) {
    // Creation for title rank 1
    const title1 = Dx.titleRank1(i);
    children.push(title1);
    for (const [key, value] of Object.entries(fullIoDict[i])) {
      // Check if IOList (value) is empty
      const isEmpty = !Object.values(value).some((x) => x !== 0);
      if (isEmpty !== true) {
        // Get tag list from tag dictionnary
        const tagList = fullTagDict[i][key];
        // Create module line up from value (IOlist)
        const lineUp = Tp.lineUpBuilder(value);
        // Creation for title rank 2
        const title2 = Dx.titleRank2(key, i);
        children.push(title2);
        // Build many arrays looks like architecture
        for (const item of lineUp) {
          const array = Dx.makeTable(item, tagList);
          children.push(array);
          // Space after module row
          const space = Dx.makeRowSpace();
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
  // ........................... //
  // DOCXJS ARCHITECTURE PATTERN //
  // ........................... //
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
    saveAs(blob, `${conf[flag].docName}-${documentTitle}.docx`);
  });
}
