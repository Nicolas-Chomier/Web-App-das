import {
  Table,
  TableRow,
  TableCell,
  ShadingType,
  Paragraph,
  TextRun,
  UnderlineType,
  HeadingLevel,
  AlignmentType,
  WidthType,
  ImageRun,
} from "docx";
import { Buffer } from "buffer";
//* Class and method used to build any document in "WORD" format
class DocxJsBuilder {
  constructor(rawAbstract) {
    this.pTitle = rawAbstract.Project.Title;
  }
  //* used in method below (documentTable,documentList)
  replaceTableContent(source, targetList) {
    const str1 = source.replaceAll("@", targetList[0]);
    const str2 = str1.replaceAll("£", targetList[1]);
    const str3 = str2.replaceAll("§", targetList[2]);
    return str3;
  }
  //* used in method below (documentTitle,documentText)
  replaceTextContent(source, targetList) {
    let text = "";
    let i = 0;
    for (const item of source) {
      if (item === "@") {
        text += targetList[i];
        i += 1;
      } else {
        text += item;
      }
    }
    return text;
  }
  //* used in method below (documentTable)
  numIsPair(n) {
    return n & 1 ? true : false;
  }
}
export class DocxJsMethods extends DocxJsBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    //* Document title style
    this.sti = {
      0: {
        rank: HeadingLevel.HEADING_1,
        color: "196CE9",
        break: true,
      },
      1: {
        rank: HeadingLevel.HEADING_1,
        color: "196CE9",
        break: false,
      },
      2: {
        rank: HeadingLevel.HEADING_2,
        color: "14B90D",
        break: false,
      },
      3: {
        rank: HeadingLevel.HEADING_3,
        color: "FBBF08",
        break: false,
      },
    };
    //* Document table style
    this.sta = {
      grey: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 24,
          textColor: "FFFFFF",
          bgColor: "3C3C3C",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "000000",
          bgColor: "9D9D9D",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
      },
      orange: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 24,
          textColor: "232c33",
          bgColor: "FF6B00",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFB00F",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFDBB4",
        },
      },
      blue: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 24,
          textColor: "232c33",
          bgColor: "538ddf",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "98bbec",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "98bbec",
        },
      },
      gold: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 24,
          textColor: "232c33",
          bgColor: "fdd692",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFEED2",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 20,
          textColor: "232c33",
          bgColor: "FFEED2",
        },
      },
    };
    //* Document table style only for column
    this.scc = {
      multiColor: ["000000", "B4D2FF", "FF6B00", "0063E5", "F9B30C", "9108F1"],
    };
    //* Document list style
    this.stl = {
      classic: {
        bold: false,
        font: "Calibri",
        textSize: 20,
        color: "000000",
      },
    };
    //* Document table custom color
    this.customColor = {
      GREY: "C7C7C7",
      BLUE: "0063E5",
      GREEN: "16CD07",
      RED: "EB0D0D",
      CYAN: "0AEAF0",
      PURPLE: "9108F1",
      ORANGE: "F9B30C",
      BROWN: "744611",
    };
    //* Document array style
    this.sar = { multi: [] };
  }
  /**
   * * Method used to write title on document
   * @param source = content / title to write
   * ? source shape needed => "string"
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param rank = rank / size of the title
   * ? source shape needed => int
   * * title style object define in constructor
   * @param targetList = Each @ in content can replace by item in list 'first input first output'
   * ? source shape needed => ["string"]
   */
  documentTitle(source, child, rank = 1, targetList = [], pBreak = false) {
    if (Array.isArray(child)) {
      const style = this.sti[rank];
      const title = new Paragraph({
        children: [
          new TextRun({
            text: !targetList.length
              ? `${source}`
              : this.replaceTextContent(source, targetList),
            color: style.color,
          }),
        ],
        heading: style.rank,
        thematicBreak: false,
        pageBreakBefore: !pBreak ? style.break : true,
        alignment: AlignmentType.START,
      });
      child.push(title);
      return true;
    }
    return false;
  }
  /**
   * * Method used to write text on document
   * @param source = content / text to write
   * ? source shape needed => "string"
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param targetList = Each @ in content can replace by item in list 'first input first output'
   * ? source shape needed => ["string"]
   * @param bold... = classic customisation param for Word text
   */
  documentText(
    source,
    child,
    targetList = [],
    bold = false,
    font = "Calibri",
    textSize = 20,
    color = "000000",
    italics = false,
    underline = false
  ) {
    if (Array.isArray(child) && !!source) {
      const text = new Paragraph({
        children: [
          new TextRun({
            text: !targetList.length
              ? `${source}`
              : this.replaceTextContent(source, targetList),
            bold: bold,
            font: font,
            size: textSize,
            color: color,
            italics: italics,
            underline: underline
              ? {
                  type: UnderlineType.SINGLE,
                  color: color,
                }
              : false,
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
      });
      child.push(text);
      return true;
    }
    return false;
  }
  /**
   * * Method used to write table on document
   * @param source = content / table to write
   * ? source shape needed => [["string"],["string"],...]
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param targetList = Each @,£,§ in content can replace by item in list, ex: all @ will be replace by targetList rank 0
   * ? source shape needed => ["string 1 @", "string 2 £", "string 3 §"]
   * @param color = define the style of the table
   * ? source shape needed => "string"
   * * table style object define in constructor
   */
  documentTable(
    source,
    child,
    targetList = [],
    color = "grey",
    cColumn = false,
    error = false
  ) {
    if (Array.isArray(child) && source.length !== 0) {
      const rowStyle = this.sta[color];
      const colStyle = cColumn ? this.scc[cColumn] : false;
      const span = source[1].length;
      const table = new Table({
        columnWidths: [],
        rows: [],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      });
      source.forEach((element, key) => {
        const colorRow = key > 1 ? (this.numIsPair(key) ? 3 : 2) : key;
        let colorCol = 0;
        const row = new TableRow({
          children: [],
        });
        element.forEach((item) => {
          colorCol += 1;

          const text = !targetList.length
            ? `${item !== undefined ? item : ""}`
            : this.replaceTableContent(item, targetList);
          row.root.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text,
                      bold: rowStyle[colorRow].bold,
                      font: rowStyle[colorRow].font,
                      size: rowStyle[colorRow].textSize,
                      color: colStyle
                        ? colorCol > colStyle[colorCol].length || key <= 1
                          ? rowStyle[colorRow].textColor
                          : colStyle[colorCol]
                        : rowStyle[colorRow].textColor,
                    }),
                  ],
                }),
              ],
              shading: {
                type: ShadingType.SOLID,
                color:
                  item in this.customColor
                    ? this.customColor[item]
                    : rowStyle[colorRow].bgColor,
              },
              columnSpan: !key ? span : 0,
            })
          );
        });
        table.root.push(row);
      });
      child.push(table);
      return true;
    }
    // Inhib or not error message if table is empty
    if (error) {
      this.documentText(
        "Non-existent or managed by Function bloc",
        child,
        [],
        false,
        "Calibri",
        12,
        "000000",
        true,
        false
      );
    }
    return false;
  }
  /**
   * * Method used to write bullet list on document
   * @param source = content / list to write
   * ? source shape needed => ["string","string",["string"],...]
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param targetList = Each @,£,§ in content can replace by item in list, ex: all @ will be replace by targetList rank 0
   * ? source shape needed => ["string 1 @", "string 2 £", "string 3 §"]
   * @param deep = define the bullet deep
   * ? source shape needed => int
   * ! this method can generate deeper level of bullet list, depend if a second tables are inside the source
   * @param style = define the style of the table
   * ? source shape needed => "string"
   *
   * * bullet list style object define in constructor
   */
  documentList(source, child, targetList = [], deep = 0, style = "classic") {
    if (Array.isArray(source) && source.length !== 0) {
      const styles = this.stl[style];
      for (const item of source) {
        if (Array.isArray(item) && item.length !== 0) {
          const ld = deep + 1;
          for (const value of item) {
            const text = !targetList.length
              ? `${value}`
              : this.replaceTableContent(value, targetList);
            const bullet = new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  bold: styles.bold,
                  font: styles.font,
                  size: styles.textSize,
                  color: styles.color,
                }),
              ],
              bullet: {
                level: ld,
              },
            });
            child.push(bullet);
          }
        } else {
          const text = !targetList.length
            ? `${item}`
            : this.replaceTableContent(item, targetList);
          const bullet = new Paragraph({
            children: [
              new TextRun({
                text: text,
                bold: styles.bold,
                font: styles.font,
                size: styles.textSize,
                color: styles.color,
              }),
            ],
            bullet: {
              level: deep,
            },
          });
          child.push(bullet);
        }
      }
      return true;
    } else {
      this.documentText(
        "Non important consumer in this installation",
        child,
        [],
        false,
        "Calibri",
        20,
        "000000",
        true,
        false
      );
      return true;
    }
  }
  /**
   * * Method used to put image on document
   * @param imageName = first import image in base64 format in main function and put it in this parameter
   * ? source shape needed => "str"
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param w = define width of image
   * ? source shape needed => int
   * @param h = define height of image
   * ? source shape needed => int
   */
  documentImage(imageName, child, w = 490, h = 290) {
    if (Array.isArray(child) && typeof imageName === "string") {
      const img = new Paragraph({
        children: [
          new ImageRun({
            data: Buffer.from(imageName, "base64"),
            transformation: {
              width: w,
              height: h,
            },
          }),
        ],
      });
      child.push(img);
    }
  }
  /**
   * * Method used to write a space on document
   * @param child = used in docxJs to render final result, result of this method is automaticly push in child
   * ? source shape needed => []
   * @param a = define space before
   * ? source shape needed => int
   * @param b = define space after
   * ? source shape needed => int
   */
  documentSpace(child, a = 50, b = 50) {
    const space = new Paragraph({
      text: "",
      spacing: {
        after: a,
        before: b,
      },
    });
    child.push(space);
    return true;
  }
}
