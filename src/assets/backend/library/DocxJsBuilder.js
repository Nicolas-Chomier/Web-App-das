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
} from "docx";
//* Class and method used to build any document in "WORD" format
class DocxJsBuilder {
  constructor(rawAbstract) {
    this.pTitle = rawAbstract.Project.Title;
  }
  //* used in method below (documentTable,documentList)
  replaceTableContent(source, targetList) {
    let text = "";
    for (const item of source) {
      if (item === "@") {
        text += targetList[0];
      } else if (item === "£") {
        text += targetList[1];
      } else if (item === "§") {
        text += targetList[2];
      } else {
        text += item;
      }
    }
    return text;
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
          textSize: 20,
          textColor: "FFFFFF",
          bgColor: "3C3C3C",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 18,
          textColor: "000000",
          bgColor: "9D9D9D",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
      },
      orange: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "FFFFFF",
          bgColor: "FF6B00",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 18,
          textColor: "000000",
          bgColor: "FFB00F",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "FFDBB4",
        },
      },
      blue: {
        0: {
          bold: true,
          font: "Calibri",
          textSize: 20,
          textColor: "FFFFFF",
          bgColor: "0059FF",
        },
        1: {
          bold: true,
          font: "Calibri",
          textSize: 18,
          textColor: "000000",
          bgColor: "4A8DFF",
        },
        2: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "FFFFFF",
        },
        3: {
          bold: false,
          font: "Calibri",
          textSize: 12,
          textColor: "000000",
          bgColor: "B4D2FF",
        },
      },
    };
    //* Document list style
    this.stl = {
      classic: {
        bold: false,
        font: "Calibri",
        textSize: 10,
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
  documentTitle(source, child, rank = 1, targetList = []) {
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
        pageBreakBefore: style.break,
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
    textSize = 10,
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
   * * Method used to write array on document
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
  documentTable(source, child, targetList = [], color = "grey") {
    if (Array.isArray(child) && source.length !== 0) {
      const style = this.sta[color];
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
        const colorKey = key > 1 ? (this.numIsPair(key) ? 3 : 2) : key;
        const row = new TableRow({
          children: [],
        });
        element.forEach((item) => {
          const text = !targetList.length
            ? `${item}`
            : this.replaceTableContent(item, targetList);
          row.root.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text,
                      bold: style[colorKey].bold,
                      font: style[colorKey].font,
                      size: style[colorKey].textSize,
                      color: style[colorKey].textColor,
                    }),
                  ],
                }),
              ],
              shading: {
                type: ShadingType.SOLID,
                color:
                  item in this.customColor
                    ? this.customColor[item]
                    : style[colorKey].bgColor,
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
    if (Array.isArray(source) && Array.isArray(child)) {
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
    }
    return false;
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
