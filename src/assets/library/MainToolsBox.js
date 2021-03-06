import proface from "../shared/providerInfos/proface.json";
import { Buffer } from "buffer";
import { Table, TableRow, TableCell } from "docx";
import { Paragraph, TextRun } from "docx";
import { VerticalAlign, WidthType } from "docx";
import { ImageRun } from "docx";
//
const profaceDatas = JSON.parse(JSON.stringify(proface));

class MainToolsBox {
  constructor(rawAbstract, flag) {
    this.privateDatas = require(`../shared/Private/${flag}-elementDataSet.json`);
    this.infosElement = rawAbstract.Elements;
    this.emptyIoListModel = { DI: 0, DO: 0, AI: 0, AO: 0, AIt: 0 };
    this.projectTitle = rawAbstract.Project.Title;
    this.coef = rawAbstract.Project.Coef;
    this.openAir = rawAbstract.Project.OpenAir;
    this.hmiId = rawAbstract.Project.Technology.id;
    this.native = rawAbstract.Project.Technology.nativeDevice;
    this.noSlot = "";
  }
}
// Specific class for quotation document
export class QTSBuilder extends MainToolsBox {
  constructor(rawAbstract, flag) {
    super(rawAbstract, flag);
    this.aaa = "";
  }
  /**
   * @param source pre-formatted empty table with the same format of return
   * @returns [["string"],["string","string"],["string","string"]...]
   */
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
  /**
   * @param source pre-formatted empty table with the same format of return
   * @param moduleList list of module used in project this list is generated with PROFACE Class
   * @returns [["string"],["string","string"],["string","string"]...]
   */
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
// Specific class for af document
export class AFBuilder extends MainToolsBox {
  constructor(rawAbstract, flag) {
    super(rawAbstract, flag);
    this.cmdCtrlRow1 = [
      "D??SIGNATION",
      "TYPE",
      "N??",
      "CONDITION D'ACTIVATION",
      "FONCTION",
    ];
    this.faultRow1 = ["NOM", "ALARME", "CONDITION D'ACTIVATION"];
    this.faultTableOverview = ["NOM", "TYPE", "ADRESSE", "IMPACT"];
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
      if (this.privateDatas[id]["FunctionBloc"] === false) {
        table.push([tag]);
        table.push(this.cmdCtrlRow1);
        for (const [key, value] of Object.entries(
          this.privateDatas[id]["IO"]
        )) {
          for (let i = 0; i < value; i++) {
            const size = this.privateDatas[id]["AF"][flag][key][i].length;
            //! Attention ! Erreur possible si IOList ne correspond pas avec la taille de la liste de liste de text correspondante
            if (size !== 0) {
              const data = this.privateDatas[id]["AF"][flag][key][i];
              table.push(this.buildCompleteArray(i, key, data));
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
    const checkFb = this.privateDatas[id]["FunctionBloc"];
    return checkFb;
  }
  /** */
  faultTable(source, flag) {
    const tensor = [];
    for (const item of source) {
      const table = [];
      const id = item[0];
      const tag = item[1];
      const size = this.privateDatas[id]["FAULTS"][flag][0].length;
      if (this.privateDatas[id]["FunctionBloc"] === false && size !== 0) {
        table.push([tag]);
        table.push(this.faultRow1);
        for (let i = 0; i < this.privateDatas[id]["FAULTS"][flag].length; i++) {
          table.push(this.privateDatas[id]["FAULTS"][flag][i]);
        }
        tensor.push(table);
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
      table.push([target]);
      table.push(this.faultTableOverview);
      for (const item of source) {
        const id = item[0];
        const tag = item[1];
        const faults = this.privateDatas[id]["FAULTS"][flag];
        const fb = this.privateDatas[id]["FunctionBloc"];
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
// Specific class for architecture document
export class ARCHBuilder extends MainToolsBox {
  constructor(rawAbstract, flag) {
    super(rawAbstract, flag);
    this.colorPanel = {
      DI: "244EF1",
      DO: "FFA300",
      AI: "B936CD",
      AO: "af3e4d",
      AIt: "DD122D",
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
            tagList[key].length > 0 ? tagList[key].shift() : "disponible";
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
    const arrayTitle = [`Tableau d'entr??es sortie pour ${title}`];
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
        const tag = rawTag === undefined ? "Disponible" : rawTag;
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
// Specific class for IO list document
export class IOLISTBuilder extends MainToolsBox {
  constructor(rawAbstract, flag) {
    super(rawAbstract, flag);
    this.com = "";
  }
  nativePlcIo() {
    return profaceDatas.PROFACE[this.hmiId]["NativeIO"];
  }
  /**
   * Method which build raw table with needed value for one module given, Tag and other info are push inside from idList and tagList.
   * * value used for build raw array : ['Way N??', 'Fonction', 'Label', 'Type', 'Description', 'Module REF']
   * @param idList {DI: Array(id), DO: Array(id), AI: Array(id), AO: Array(id), AIt: Array(id)}
   * @param tagList {DI: Array(tag), DO: Array(tag), AI: Array(tag), AO: Array(tag), AIt: Array(tag)}
   * @param module "string" (name of module given)
   * @param moduleNbs integer (module number, if module with the same name appear many time in the same line up)
   * @param firstRow [string, ...] (first line for the table result construction)
   * @param type "string" (type of line up in the architecture project like example : "MAIN" or "Compressor 1"
   * @param flag "string" chosen language (fr or uk)
   * @returns table [["string"],["string,..."] ...]
   */
  ioListTableForLineUp(idList, tagList, module, moduleNbs, firstRow, flag) {
    const table = [];
    const com = "";
    const mIoL = profaceDatas.PROFACE[module]["IoList"];
    const mRef = profaceDatas.PROFACE[module]["Reference"];
    // Build table sub title
    const title = `Module R??f : ${mRef}`;
    table.push([title], firstRow);
    for (const [key, value] of Object.entries(mIoL)) {
      for (let i = 0; i < value; i++) {
        const ctObj = this.counter(tagList[key]);
        const actualTag = tagList[key][0];
        const ctr = ctObj[actualTag];
        const tag =
          tagList[key].length > 0 ? tagList[key].shift() : this.noSlot;
        const id = idList[key].length > 0 ? idList[key].shift() : this.noSlot;
        const func = this.addFunc(id, key, ctr, flag);
        const way = this.addWay(key, i, moduleNbs);
        table.push([way, func, tag, key, com]);
      }
    }
    return table;
  }
  /**
   * Method which build raw table with needed value for PLC with native Input Output device.
   * * Likely the same method than "ioListTableForLineUp"
   * @param idList {DI: Array(id), DO: Array(id), AI: Array(id), AO: Array(id), AIt: Array(id)}
   * @param tagList {DI: Array(tag), DO: Array(tag), AI: Array(tag), AO: Array(tag), AIt: Array(tag)}
   * @param key "string" (name of device)
   * @param value integer (number of Input or output in given device)
   * @param firstRow [string, ...] (first line for the table result construction)
   * @param title "string" (PLC reference)
   * @param flag "string" chosen language (fr or uk)
   * @returns table [["string"],["string,..."] ...]
   */
  ioListTableForPlc(idList, tagList, key, value, title, firsRow, flag) {
    const table = [];
    if (value) {
      table.length = 0;
      const titleC = typeof title === "string" ? title : this.projectTitle;
      const titleT = `${key} for ${titleC}`;
      table.push([titleT], firsRow);
      for (let i = 0; i < value; i++) {
        const ctObj = this.counter(tagList);
        const actualTag = tagList[0];
        const ctr = ctObj[actualTag];
        const tag = tagList.length > 0 ? tagList.shift() : this.noSlot;
        const id = idList.length > 0 ? idList.shift() : this.noSlot;
        const func = this.addFunc(id, key, ctr, flag);
        const way = this.addWay(key, i);
        table.push([way, func, tag, `${key}`, "", titleC]);
      }
      return table;
    }
    return table;
  }
  /**
   * Method which count number of occurence in given parameter
   * @param list ["string",...]
   * @returns counts {string:int,...}
   */
  counter(list) {
    const counts = {};
    list.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
  }
  addFunc(id, key, counter, flag) {
    const target = this.privateDatas[id]["Text"][flag][key];
    const text = typeof target === "string" ? target : target[counter - 1];
    return text;
  }
  addWay(key, i, moduleNbs = false) {
    const trackId = `M${moduleNbs}/${i + 1}`;
    const trackId2 = `${key}/${i + 1}`;
    return moduleNbs ? trackId : trackId2;
  }
}
