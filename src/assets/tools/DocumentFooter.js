import { Footer, Paragraph, ImageRun, TextRun, AlignmentType } from "docx";
import { Buffer } from "buffer";
// Images importation for footer
import { IF1 } from "../image/image_footer_1";
// Data to display inside footer
const name = "Nicolas CHOMIER";
const mail = "nicolaschomier@dalkiaairsolutions.fr";
// Size for image document header:
const width = 120;
const height = 110;
// Factorisation for all documents footer
export const footer = {
  default: new Footer({
    // Footer with images
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: Buffer.from(IF1, "base64"),
            transformation: {
              width: width,
              height: height,
            },
            floating: {
              horizontalPosition: {
                offset: 700000,
              },
              verticalPosition: {
                offset: 9250000,
              },
            },
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: name,
            bold: true,
            font: "Calibri",
            size: 20,
            color: "2E2E2E",
          }),

          new TextRun({
            break: 1,
          }),
          new TextRun({
            text: mail,
            bold: true,
            font: "Calibri",
            size: 20,
            color: "2E2E2E",
          }),
        ],
        alignment: AlignmentType.RIGHT,
      }),
    ],
  }),
};
