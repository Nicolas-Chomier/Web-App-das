import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, WidthType, Paragraph, HeadingLevel } from "docx";
import { Table, AlignmentType } from "docx";
// Home made class importation
import { DataBuilder, DocxBuilder } from "../tools/DocumentBuilder";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_ElementsList(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["quotation"][tongue === 0 ? "uk" : "fr"];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  // Get project title
  const projectTitle = Dx.buildTitle();
  // Build the main adress list
  const adressList = Dt.buildAdressList();
  // Build docxjs table
  const table1 = Dx.docxTable(adressList);
  // DOCXJS ARCHITECTURE PATTERN //
  const doc = new Document({
    sections: [
      {
        headers: header,
        footers: footer,
        children: [
          // Title rank 1
          new Paragraph({
            text: projectTitle,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: false,
            alignment: AlignmentType.CENTER,
          }),
          // Introduction text
          new Paragraph({
            text: speak.text1,
            alignment: AlignmentType.LEFT,
          }),
          // Adress list table
          new Table({
            columnWidths: [500, 1000, 800, 800, 800, 800, 800, 800],
            rows: table1,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      },
    ],
  });
  // Print document
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${speak.docName}-${projectTitle}.docx`);
  });
}
