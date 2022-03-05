import { Footer, Paragraph, TextRun } from "docx";
// Data to display inside footer
const text =
  "This document is the property of the issuer. It must not be reproduced, communicated or published, even in part, without its written authorization.";
// Factorisation for all documents footer
export const footer = {
  default: new Footer({
    // Footer with images
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: false,
            font: "Calibri",
            size: 18,
            color: "2E2E2E",
          }),
        ],
      }),
    ],
  }),
  first: new Footer({
    children: [],
  }),
};
