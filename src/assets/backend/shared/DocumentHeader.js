import { Header, Paragraph, ImageRun } from "docx";
import { Buffer } from "buffer";
// Images importation for header
import { IH1 } from "./images/image_header_1";
import { IH2 } from "./images/image_header_2";
import { IH3 } from "./images/image_header_3";
import { IH4 } from "./images/image_header_4";
import { IH5 } from "./images/image_header_5";
// Size for image document header:
const width = 120;
const height = 110;
// Factorisation for all documents header
export const header = {
  default: new Header({
    // Header with images
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: Buffer.from(IH1, "base64"),
            transformation: {
              width: width,
              height: height,
            },
          }),
          new ImageRun({
            data: Buffer.from(IH2, "base64"),
            transformation: {
              width: width,
              height: height,
            },
          }),
          new ImageRun({
            data: Buffer.from(IH3, "base64"),
            transformation: {
              width: width,
              height: height,
            },
          }),
          new ImageRun({
            data: Buffer.from(IH4, "base64"),
            transformation: {
              width: width,
              height: height,
            },
          }),
          new ImageRun({
            data: Buffer.from(IH5, "base64"),
            transformation: {
              width: width,
              height: height,
            },
          }),
        ],
      }),
    ],
  }),
};
