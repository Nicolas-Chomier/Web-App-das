import { Architecture, IOList } from "./Builder";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function generateDocx() {
  const doc = new Document({
    background: {
      color: "C45911",
    },
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: "Foo Bar",
                bold: true,
              }),
              new TextRun({
                text: "\tGithub is the best",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "example.docx");
    console.log("Document created successfully");
  });
}
