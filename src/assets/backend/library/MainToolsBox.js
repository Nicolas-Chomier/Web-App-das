import proface from "../../data/proface.json";
import privates from "../../data/private.json";
//
import { Buffer } from "buffer";
import { Table, TableRow, TableCell } from "docx";
import { Paragraph, TextRun } from "docx";
import { VerticalAlign, WidthType } from "docx";
import { ImageRun } from "docx";
//
const profaceDatas = JSON.parse(JSON.stringify(proface));
const privateDatas = JSON.parse(JSON.stringify(privates));

class MainToolsBox {
  constructor(rawAbstract) {
    this.infosElement = rawAbstract.Elements;
    this.emptyIoListModel = { DI: 0, DO: 0, AI: 0, AO: 0, AIt: 0 };
    this.projectTitle = rawAbstract.Project.Title;
    this.coef = rawAbstract.Project.Coef;
    this.openAir = rawAbstract.Project.OpenAir;
    this.hmiId = rawAbstract.Project.Technology.id;
    this.native = rawAbstract.Project.Technology.nativeDevice;
    this.noSlot = "Spare";
  }
}
/**
 * TODO a commenter !
 */
export class QTSBuilder extends MainToolsBox {
  nomenclatureForHmi(source) {
    const typeOfPlc = profaceDatas.PROFACE[this.hmiId]["NativeIO"];
    const conceptionList =
      typeOfPlc === false ? ["HMI", "PLC", "CAN"] : ["HMI"];
    const table = [...source];
    for (const item of conceptionList) {
      const _list = [];
      _list.push(item);
      _list.push(profaceDatas.PROFACE[this.hmiId][item]["Denomination"]);
      _list.push(profaceDatas.PROFACE[this.hmiId][item]["Ref"]);
      _list.push("1");
      table.push(_list);
    }
    return table;
  }
  nomenclatureForModule(source, moduleList) {
    const table = [...source];
    for (const [key, value] of Object.entries(moduleList)) {
      if (value !== 0) {
        const rows = [];
        rows.push(profaceDatas.PROFACE[key]["Reference"]);
        rows.push(profaceDatas.PROFACE[key]["Manufacturer"]);
        rows.push(profaceDatas.PROFACE[key]["Description"]);
        rows.push(`${value}`);
        table.push(rows);
      }
    }
    return table;
  }
}
/**
 * TODO a commenter !
 */
export class AFBuilder extends MainToolsBox {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.cmdCtrlRow1 = [
      "DESIGNATION",
      "TYPE",
      "N°",
      "ACTIVATION CONDITION",
      "FUNCTION",
    ];
    this.faultRow1 = ["NAME", "ALARM", "ACTIVATION CONDITION"];
    this.faultTableOverview = ["NAME", "TYPE", "ADRESS", "IMPACT"];
  }
  /** */
  editedDeviceInformations(type) {
    const Den = profaceDatas.PROFACE[this.hmiId][type].Denomination;
    const Ref = profaceDatas.PROFACE[this.hmiId][type].Ref;
    const Dev = profaceDatas.PROFACE[this.hmiId][type].Devices;
    const intro = `${Den}(${Ref}) with:`;
    return [intro, Dev];
  }
  /** */
  // Method which build control and command table according infos inside private JSON
  controlAndCommandTable(source, flag) {
    const matrix = [];
    for (const item of source) {
      const table = [];
      const id = item[0];
      const tag = item[1];
      if (privateDatas[id]["FunctionBloc"] === false) {
        table.push([tag]);
        table.push(this.cmdCtrlRow1);
        for (const [key, value] of Object.entries(privateDatas[id]["IO"])) {
          for (let i = 0; i < value; i++) {
            const size = privateDatas[id]["AF"][flag][key][i].length;
            if (size !== 0) {
              const data = privateDatas[id]["AF"][flag][key][i];
              table.push(this.buildCompleteArray(i, key, data));
              // Attention ! Erreur possible si IOList ne correspond pas avec la taille de la liste de liste de text correspondante
            }
          }
        }
        matrix.push(table);
      } else {
        matrix.push(table);
      }
    }
    //console.log("matrice", matrix); //(to keep for debug)
    return matrix;
  }
  buildCompleteArray(i, key, data) {
    const newData = [...data];
    newData.splice(1, 0, key);
    newData.splice(2, 0, i + 1);
    return newData;
  }
  checkFb(id) {
    const checkFb = privateDatas[id]["FunctionBloc"];
    return checkFb;
  }
  /** */
  faultTable(source, flag) {
    const tensor = [];
    for (const item of source) {
      const table = [];
      const id = item[0];
      const tag = item[1];
      const size = privateDatas[id]["FAULTS"][flag][0].length;
      if (privateDatas[id]["FunctionBloc"] === false) {
        if (size !== 0) {
          table.push([tag]);
          table.push(this.faultRow1);
          for (let i = 0; i < privateDatas[id]["FAULTS"][flag].length; i++) {
            table.push(privateDatas[id]["FAULTS"][flag][i]);
          }
          tensor.push(table);
        }
      } else {
        tensor.push(table);
      }
    }
    return tensor;
  }
  /** */
  faultsTableOverviewFor(source, target, flag) {
    const table = [];
    if (Array.isArray(source) && source.length !== 0) {
      const table = [];
      table.push([target]);
      table.push(this.faultTableOverview);
      for (const item of source) {
        const id = item[0];
        const tag = item[1];
        const faults = privateDatas[id]["FAULTS"][flag];
        const fb = privateDatas[id]["FunctionBloc"];
        for (const fault of faults) {
          if (target === fault[1]) {
            const newTag = fault[0].replace("TAG", tag);
            table.push([newTag, fault[1], "WIP", fb ? fault[2] : "WIP"]);
          }
        }
      }
      return table;
    }
    return table;
  }
}
/**
 * TODO a commenter !
 */
export class ARCHBuilder extends MainToolsBox {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.colorPanel = {
      DI: "B4D2FF",
      DO: "FF6B00",
      AI: "0063E5",
      AO: "F9B30C",
      AIt: "9108F1",
    };
  }
  nativeDeviceInfos() {
    const bool = typeof this.native === "boolean" ? this.native : false;
    return bool;
  }
  // Method which build architecture under table shape for each array given in parameters
  drawedTable(lineUp, children, tagListing, imgListing) {
    const table = new Table({
      rows: [
        // Call method which build array text
        new TableRow({
          children: this.makeRowText(lineUp),
        }),
        // Call method which build array image
        new TableRow({
          children: this.makeRowImage(lineUp, imgListing),
        }),
        // Call methods which build array list of input output
        new TableRow({
          children: this.makeRowList(lineUp, tagListing),
        }),
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
    children.push(table);
    return true;
  }
  // Sub method which fill TableCell children with text (only for tableShapeArchitecture method)
  makeRowText(lineUp) {
    const list = [];
    const targetRef = "Reference";
    for (const module of lineUp) {
      const text = `${profaceDatas.PROFACE[module][targetRef]}`;
      list.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  bold: false,
                  font: "Calibri",
                  size: 20,
                  color: "2E2E2E",
                }),
              ],
            }),
          ],
          width: {
            size: 1,
            type: WidthType.PERCENTAGE,
          },
        })
      );
    }
    return list;
  }
  // Sub method which fill TableCell children with image (only for tableShapeArchitecture method)
  makeRowImage(lineUp, imgListing) {
    const list = [];
    const targetImg = "Img";
    for (const module of lineUp) {
      const imageNumber = profaceDatas.PROFACE[module][targetImg];
      list.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: Buffer.from(imgListing[imageNumber], "base64"),
                  transformation: {
                    width: 50,
                    height: 150,
                  },
                }),
              ],
            }),
          ],
          width: {
            size: 1,
            type: WidthType.PERCENTAGE,
          },
          verticalAlign: VerticalAlign.CENTER,
        })
      );
    }
    return list;
  }
  // Sub method which fill TableCell children with bullet point (only for tableShapeArchitecture method)
  makeRowList(lineUp, tagListing) {
    const list = [];
    const targetIol = "IoList";
    for (const module of lineUp) {
      const moduleIOList = profaceDatas.PROFACE[module][targetIol];
      list.push(this.attribTagToRowList(moduleIOList, tagListing));
    }
    return list;
  }
  // Pick tag to dictionnary tag and fill list according module size
  attribTagToRowList(moduleIoList, tagList) {
    const list = [];
    for (const [key, value] of Object.entries(moduleIoList)) {
      if (value !== 0) {
        for (let i = 0; i < value; i++) {
          const tag =
            tagList[key].length > 0 ? tagList[key].shift() : this.noSlot;
          list.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: tag,
                  bold: false,
                  font: "Calibri",
                  size: 20,
                  color:
                    key in this.colorPanel ? this.colorPanel[key] : "2E2E2E",
                }),
              ],
            })
          );
        }
      }
    }
    const rowList = new TableCell({
      children: list,
      width: {
        size: 1,
        type: WidthType.PERCENTAGE,
      },
    });
    return rowList;
  }
  /** */
  nativeArchitectureTable(source, title = "") {
    const nativIo = profaceDatas.PROFACE[this.hmiId]["NativeIO"];
    const arrayTitle = [`IO array for ${title}`];
    const RawTable = [];
    const firstRow = [];
    const result = [arrayTitle];
    let count = 0;
    // Build raw table only if nativIo exist
    for (const [key, value] of Object.entries(nativIo)) {
      if (value > count) count = value;
      firstRow.push(key);
      const rowKey = [];
      for (let i = 0; i < value; i++) {
        const rawTag = source["MAIN"][key].shift();
        const tag = rawTag === undefined ? "Available" : rawTag;
        rowKey.push(tag);
      }
      RawTable.push(rowKey);
    }
    result.push(firstRow);
    // Reshape table
    for (let i = 0; i < count; i++) {
      const rowX = [];
      for (const item of RawTable) {
        rowX.push(item[i]);
      }
      result.push(rowX);
    }
    return result;
  }
}
/**
 * TODO a commenter !
 */
export class IOLISTBuilder extends MainToolsBox {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.com = "";
  }
  //
  nativePlcIo() {
    return profaceDatas.PROFACE[this.hmiId]["NativeIO"];
  }
  // Method which count duplicate in given list
  counter(list) {
    const counts = {};
    list.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
  }
  //Special == LT4000
  reshapeTagListSpecial(idList, tagList, key, value, title, firsRow, flag) {
    const result = this.ioListTableForPlc(
      idList,
      tagList,
      key,
      value,
      title,
      firsRow,
      flag
    );
    const _olist = [];
    _olist.length = 0;
    for (const item of result) {
      _olist.push(item);
    }
    return _olist;
  }
  //
  ioListTableForPlc(idList, tagList, key, value, title, firsRow, flag) {
    console.log("#######", key, value);
    const table = [];
    table.length = 0;
    const titleT = typeof title === "string" ? title : this.projectTitle;
    //table.push([titleT], firsRow);*
    table.push(firsRow);
    for (let i = 0; i < value; i++) {
      const ctObj = this.counter(tagList);
      //console.log(")))))))))))))))))))", tagList);
      const actualTag = tagList[0];
      const ctr = ctObj[actualTag];
      const tag = tagList.length > 0 ? tagList.shift() : this.noSlot;
      const id = idList.length > 0 ? idList.shift() : this.noSlot;
      const func = this.addFunc(id, key, ctr, flag);
      const way = this.addWay(key, i);
      table.push([way, func, tag, `${key}`, "", titleT]);
      console.log(table);
    }
    return table;
  }
  addFunc(id, key, counter, flag) {
    //console.log(id, key, counter, flag);
    const target = privateDatas[id]["Text"][flag][key];

    //console.log("target", target);
    const text = typeof target === "string" ? target : target[counter - 1];
    return text;
  }
  addWay(key, i) {
    const num = `${key}/${i + 1}`;
    return num;
  }
}

/* if (Array.isArray(data)) {
  const table = [];
  for (let i = 0; i < data.length; i++) {
    const id = idListing[types][key].shift();
    const way = `${key}/i`;
    const func = privateDatas[id]["Text"][flag][key];
    const label = tagListing[types][key].shift();
    const type = `${key}`;
    const desc = "";
    const module = titleT;
  } */
