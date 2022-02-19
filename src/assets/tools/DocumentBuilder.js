import { Buffer } from "buffer";
import { Table, TableRow, TableCell } from "docx";
import { Paragraph, TextRun } from "docx";
import { HeadingLevel, VerticalAlign, AlignmentType, WidthType } from "docx";
import { TableOfContents } from "docx";
import { ImageRun } from "docx";
// Images importation
import { IM1 } from "../image/image_module_pf_1";
import { IM2 } from "../image/image_module_pf_2";
import { IM3 } from "../image/image_module_pf_3";
import { IM4 } from "../image/image_module_pf_4";
import { IM5 } from "../image/image_module_pf_5";
import { IM6 } from "../image/image_module_pf_6";
import { IM7 } from "../image/image_module_pf_7";
// External datas importation
import privates from "../data/private.json";
import proface from "../data/proface.json";

// Main class used to help application to build document with docxJS
class DocumentBuilder {
  constructor(rawAbstract) {
    // Load special datas from JSON used by all children class
    this.private = JSON.parse(JSON.stringify(privates));
    this.proface = JSON.parse(JSON.stringify(proface));
    // Initiate the result from the FRONT with elements list
    this.infosElement = rawAbstract.Elements;
    // Initiate the result from the FRONT with project datas
    this.projectTitle = rawAbstract.Project.Title;
    this.coef = rawAbstract.Project.Coef;
    this.group = rawAbstract.Project.Group;
    this.openAir = rawAbstract.Project.OpenAir;
    this.HMI_id = rawAbstract.Project.Technology.id;
    // Main list configuration for different type of input output hardware
    this.hwl = ["DI", "DO", "AI", "AO", "AIt"];
    // Name put in input output module list when no correspondance in tag list
    this.noSlot = "Spare";
  }
  // Method wich return empty Object
  object() {
    const _obj = {};
    for (const prop of Object.getOwnPropertyNames(_obj)) {
      delete _obj[prop];
    }
    return _obj;
  }
  // Method wich return empty list
  list(item) {
    const _list = [];
    _list.length = 0;
    if (item) {
      _list.push(item);
    }
    return _list;
  }
  // Empty IOList model
  emptyIolist() {
    const _obj = this.object();
    for (const item of this.hwl) {
      _obj[item] = 0;
    }
    return _obj;
  }
  // Empty tagList model
  emptyTagList() {
    const _obj = this.object();
    for (const item of this.hwl) {
      _obj[item] = this.list();
    }
    return _obj;
  }
  // Method wich return an formatted empty structure only to use with dictionnaryWithIO method
  emptyShapeForIolist() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = { MAIN: this.emptyIolist() };
    }
    return obj;
  }
  // Method wich return an formatted empty structure only to use with dictionnaryWithTag method
  emptyShapeForTagList() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = { MAIN: this.emptyTagList() };
    }
    return obj;
  }
  // Method wich delete duplicate in front elements list (tag is unique)
  removeAbstractDuplicate() {
    const uniqueObjects = [
      ...new Map(this.infosElement.map((item) => [item.tag, item])).values(),
    ];
    return uniqueObjects;
  }
}
// Class wich regroup methods used to build documents //
export class DataBuilder extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.openAirLabel1 = "OPA-F"; // Identification word for an Open Air compressor fixe
    this.openAirLabel2 = "OPA-V"; // Identification word for an Open Air compressor variable
    this.rsl = { DI: 8, DO: 6, AI: 1, AO: 0, AIt: 0 }; // Mandatory reserved slot attribute to each project
    this.rName = "Reserved"; // Tag used to fill reserved slot
    this.rId = "0000";
  }
  // Method which return fullfilled dictionnary with all item's id stored correctly
  idListDictionnary() {
    const dataset = this.removeAbstractDuplicate();
    const structure = this.emptyShapeForTagList();
    let j = 1;
    for (const item of dataset) {
      if (
        item.name !== this.openAirLabel1 &&
        item.name !== this.openAirLabel2
      ) {
        for (const [key, value] of Object.entries(
          this.private[item.id]["IO"]
        )) {
          if (value !== 0) {
            for (let i = 0; i < value; i++) {
              structure[item.group]["MAIN"][key].push(item.id);
            }
          }
        }
      } else {
        structure[item.group][`CP0${j}`] = this.emptyTagList();
        for (const [key, value] of Object.entries(
          this.private[item.id]["IO"]
        )) {
          if (value !== 0) {
            for (let i = 0; i < value; i++) {
              structure[item.group][`CP0${j}`][key].push(item.id);
            }
          }
        }
        j += 1;
      }
    }
    return structure;
  }
  // Method used to add mandatory slots to standard dictionnary (default grp 1)
  idListObject(grp = 1) {
    //amelioration possible en autorisant tt les group a avoir des mandatory slot !!
    const _obj = this.idListDictionnary();

    // Security against bad group number:
    if (grp > this.group || grp <= 0) {
      grp = 1;
    }
    // Fill choosen group with reserved slot:
    for (const [key, value] of Object.entries(_obj[grp]["MAIN"])) {
      //console.log("====", key, value); // Keep to understand or debug
      // Avoid Open Air compressor line
      if (key in this.rsl === true) {
        for (let i = 0; i < this.rsl[key]; i++) {
          value.unshift(this.rId);
        }
      }
    }
    return _obj;
  }
  // Method which return fullfilled dictionnary with all item's tag stored correctly
  tagListDictionnary() {
    const dataset = this.removeAbstractDuplicate();
    const structure = this.emptyShapeForTagList();
    let j = 1;
    for (const item of dataset) {
      if (
        item.name !== this.openAirLabel1 &&
        item.name !== this.openAirLabel2
      ) {
        for (const [key, value] of Object.entries(
          this.private[item.id]["IO"]
        )) {
          if (value !== 0) {
            for (let i = 0; i < value; i++) {
              structure[item.group]["MAIN"][key].push(item.tag);
            }
          }
        }
      } else {
        structure[item.group][`CP0${j}`] = this.emptyTagList();
        for (const [key, value] of Object.entries(
          this.private[item.id]["IO"]
        )) {
          if (value !== 0) {
            for (let i = 0; i < value; i++) {
              structure[item.group][`CP0${j}`][key].push(item.tag);
            }
          }
        }
        j += 1;
      }
    }

    return structure;
  }
  // Method used to add mandatory slots to standard dictionnary (default grp 1)
  tagListObject(grp = 1) {
    //amelioration possible en autorisant tt les group a avoir des mandatory slot !!
    const _obj = this.tagListDictionnary();
    // Security against bad group number:
    if (grp > this.group || grp <= 0) {
      grp = 1;
    }
    // Fill choosen group with reserved slot:
    for (const [key, value] of Object.entries(_obj[grp]["MAIN"])) {
      //console.log("====", key, value); // Keep to understand or debug
      // Avoid Open Air compressor line
      if (key in this.rsl === true) {
        for (let i = 0; i < this.rsl[key]; i++) {
          value.unshift(this.rName);
        }
      }
    }
    return _obj;
  }
  // Method which build a usefull IOList dictionnary from raw abstract elements list
  fullIolistProject() {
    const dataset = this.removeAbstractDuplicate();
    const modele = this.emptyShapeForIolist(); // Get the empty modele
    let j = 1; // Counter for OPEN AIR Compressor
    // Loop through raw abstract elem list
    for (const value of Object.values(dataset)) {
      // Avoid "OPEN AIR" elements
      if (
        value.name !== this.openAirLabel1 &&
        value.name !== this.openAirLabel2
      ) {
        // Loop through => {ni:,no:,ai:,ao:,ti:}
        for (const [item, numbers] of Object.entries(
          this.private[value.id]["IO"]
        )) {
          modele[value.group]["MAIN"][item] += numbers;
        }
      } else {
        modele[value.group][`CP0${j}`] = this.emptyIolist();
        for (const [item, numbers] of Object.entries(
          this.private[value.id]["IO"]
        )) {
          modele[value.group][`CP0${j}`][item] += numbers;
        }
        j += 1;
      }
    }
    return modele;
  }
  // Method which add coef to fullIolistProject
  addCoefTofullIolistProject() {
    const ioList = { ...this.fullIolistProject() };
    const size = Object.keys(ioList).length; // Get number of groups
    for (let i = 1; i < size + 1; i++) {
      for (const [key, value] of Object.entries(ioList[i]["MAIN"])) {
        ioList[i]["MAIN"][key] = Math.round(value * this.coef);
      }
    }
    return ioList;
  }
  // Method which add mandatory slot to fullIolistProject with coef already added (Method to use !)
  addMandatorySlotTofullIolistProject(grp = 1) {
    const ioList = { ...this.addCoefTofullIolistProject() };
    for (const key of Object.keys(ioList[grp]["MAIN"])) {
      ioList[grp]["MAIN"][key] += this.rsl[key];
    }
    return ioList;
  }
}
// Class wich build special module and technical data like IO board (only with PROFACE)
export class Proface extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.nMax = 16; // Maximum numerical input / output module capacity
    this.nMid = 8; // Middle size numerical input / output module capacity
    this.nMin = 4; // Minimum numerical input / output module capacity
    this.aMax = 8; // Maximum numerical input / output module capacity
    this.aMid = 4; // Middle size numerical input / output module capacity
    this.aMin = 2; // Minimum numerical input / output module capacity
    this.temp = 4; // Size for temperature analog input capacity
    this.sMax = 14; // Maximum module capacity accepted by rack (PROFACE specificity)
    // Module list used for make table in designModuleLine method
    this.mSpe = ["module10", "module11", "module12"];
  }
  // Method wich calcul the numbers of numerical proface module selection according given IOList
  numericalModule(target) {
    const numericalResult = {
      module1: 0,
      module2: 0,
      module3: 0,
      module4: 0,
      module5: 0,
    };
    let ni = target.DI;
    let ri = ni % this.nMax;
    let no = target.DO;
    let ro = no % this.nMax;
    let _output = 0;
    // Numerical Input Filling :
    numericalResult.module1 += Math.floor(ni / this.nMax);
    if (ri !== 0) {
      if (ri > this.nMid) {
        numericalResult.module1 += 1;
      } else if (ri > this.nMin && ri <= this.nMid) {
        numericalResult.module2 += 1;
      } else {
        numericalResult.module5 += 1;
        _output += 4;
      }
    }
    // Correction on numerical output :
    no -= 4 * Math.floor(_output / this.nMin);
    if (no < 0) {
      no = 0;
    }
    // Numerical Output Filling :
    numericalResult.module3 += Math.floor(no / this.nMax);
    if (ro !== 0) {
      if (ro > this.nMid) {
        numericalResult.module3 += 1;
      } else if (ro > this.nMin && ro <= this.nMid) {
        numericalResult.module4 += 1;
      } else {
        numericalResult.module5 += 1;
      }
    }
    return numericalResult;
  }
  // Method wich calcul the numbers of analog proface module selection according given IOList //obsolete a refaire
  analogModule(target) {
    const analogResult = { module6: 0, module7: 0, module8: 0, module9: 0 };
    let ai = target.AI;
    let ao = target.AO;
    let ti = target.AIt;
    let ri = ai % this.aMax;
    let ro = ao % this.aMid;
    let _input = 0;
    let _output = 0;

    // Analog Input Filling :
    analogResult.module6 += Math.floor(ai / this.aMax);
    if (ri !== 0) {
      if (ri > this.aMid) {
        analogResult.module6 += 1;
        _input += this.aMax - ri;
      } else {
        analogResult.module9 += 1;
        _input += this.aMid - ri;
        _output += this.aMin;
      }
    }
    // Analog Temperature Input Filling :
    analogResult.module7 += Math.floor(ti / this.temp);
    if (ti !== 0) {
      analogResult.module7 += 1;
    }
    // Analog Output Filling :
    analogResult.module8 += Math.floor(ao / this.aMid);
    if (ro !== 0) {
      if (ro > this.aMin) {
        analogResult.module8 += 1;
        _output += this.aMid - ro;
      } else if (_output >= ro) {
        _output += this.aMin - ro;
        _input += this.aMid;
      } else {
        analogResult.module9 += 1;
        _output += this.aMin - ro;
        _input += this.aMid;
      }
    }
    // Correction :
    if (_input === this.aMid && _output === this.aMin) {
      analogResult.module9 -= 1;
    }
    return analogResult;
  }
  // Method wich calcul the numbers of special proface module according previous result on numerical and analog method
  totalModule(obj) {
    const specialModuleResult = { module10: 0, module11: 0, module12: 0 };
    let totalModules = 0;
    // Calcul the total amount of module needed by the project to determine below wich and how many special module use in the project
    for (const value of Object.values(obj)) {
      totalModules += value;
    }
    var restModule = totalModules % this.sMax;
    if (restModule > 0) {
      if (restModule <= 7) {
        specialModuleResult.module10 +=
          Math.floor(totalModules / this.sMax) + 1;
        specialModuleResult.module11 += Math.floor(totalModules / this.sMax);
        specialModuleResult.module12 += Math.floor(totalModules / this.sMax);
      } else {
        specialModuleResult.module10 +=
          Math.floor(totalModules / this.sMax) + 1;
        specialModuleResult.module11 +=
          Math.floor(totalModules / this.sMax) + 1;
        specialModuleResult.module12 +=
          Math.floor(totalModules / this.sMax) + 1;
      }
    } else {
      return specialModuleResult;
    }
    return specialModuleResult;
  }
  // Method wich return entire proface module nomenclature
  moduleBuilder(IOList) {
    // Shape of IOList needed { DI: *, DO: *, AI: *, AO: *, AIt: * }
    const moduleList = {
      ...this.numericalModule(IOList),
      ...this.analogModule(IOList),
    };
    const specialModule = this.totalModule(moduleList);
    const finalResult = { ...moduleList, ...specialModule };
    return finalResult;
  }
  // Method which transform IOList to clean and ordered line up module lists (using method below)
  lineUpBuilder(IOList) {
    // Check if IOList is empty
    const isEmpty = !Object.values(IOList).some((x) => x !== 0);
    if (isEmpty !== true) {
      // Step 1 : build raw line up module
      const raw = this.moduleBuilder(IOList);
      // Step 2 : Work on raw
      const filteredRaw = this.designModuleLine(raw);
      const splitedLineUp = this.splitModuleLine(filteredRaw);
      const orderedLineUp = this.orderedModuleLine(splitedLineUp);
      // Step 3 : return it
      return orderedLineUp;
    }
    return false;
  }
  // Method wich return a list with raw module line without special module (run only with lineUpBuilder method)
  designModuleLine(moduleLine) {
    const _list = this.list();
    // Put inside empty table all input output module define in moduleLine
    for (const [key, value] of Object.entries(moduleLine)) {
      if (value !== 0 && this.mSpe.includes(key) === false) {
        for (var i = 0; i < value; ++i) {
          _list.push(key);
        }
      }
    }
    return _list;
  }
  // Method which build group of list of module line according PROFACE specificity (run only with lineUpBuilder method)
  splitModuleLine(table) {
    const _list = this.list();
    // Emptying given table to fill sub table which match with proface specificity
    while (table.length !== 0) {
      const newTable = [];
      for (let i = 0; i < this.sMax; ++i) {
        // Remove first item of main table to push it inside new list
        const item = table.shift();
        newTable.push(item);
      }
      _list.push(newTable.filter(Boolean)); // filter remove undifined value
    }
    return _list;
  }
  // Method which add and order special module from matrix (parameter given by splitModuleLine), according PROFACE specificity (run only with lineUpBuilder method)
  orderedModuleLine(matrix) {
    const _list = this.list();
    // Add special module from matrix rows to main list
    for (const list of matrix) {
      if (list.length > 7) {
        list.splice(0, 0, "module10");
        list.splice(8, 0, "module11", "module12");
      } else {
        list.splice(0, 0, "module10");
      }
    }
    // Order special module according provider specificity
    for (const item of matrix) {
      if (item.slice(0, 9).length !== 0) {
        _list.push(item.slice(0, 9));
      }
      if (item.slice(9).length !== 0) {
        _list.push(item.slice(9));
      }
    }
    return _list;
  }
  // Method which return a list of all module line up from master iolist (used only with addObjectByKey)
  addModuleForQuotationDoc(iolist) {
    const result = this.list();
    const size = Object.keys(iolist).length; // Get number of groups
    for (let i = 0; i < size; i++) {
      for (const value of Object.values(iolist[i + 1])) {
        const moduleLineUp = this.moduleBuilder(value);
        result.push(moduleLineUp);
      }
    }
    return result;
  }
  // Method which add all module number in one module line up
  addObjectByKey(iolist) {
    const moduleList = this.addModuleForQuotationDoc(iolist);
    const result = moduleList.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
    return result;
  }
  // Method which give all info about choosen HMI
  giveMeHmiInformations(id, target) {
    return this.proface.PROFACE[id][target];
  }
}
// Class wich provide several method to design and build word document
export class DocxBuilder extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.titleEmptyGrp = "No item has been selected";
    // Variable used for make the shape of the architecture document
    this.ref = "Reference";
    this.img = "Img";
    this.ioList = "IoList";
    // Image list for proface module
    this.imgList = [IM1, IM1, IM2, IM3, IM4, IM5, IM6, IM7];
    // Displayed text configuration
    this.bold = false;
    this.font = "Calibri";
    this.size = 16;
    this.color = "2E2E2E";
    // Color attribution depending of input or output type
    this.colorPanel = {
      DI: "30FF18",
      DO: "2CC132",
      AI: "1CD2FF",
      AO: "1C87FF",
      AIt: "FFB01C",
    };
  }
  // Method which put in place of @ item given in item list parameter ATTENTION to give same list size to @ in str
  makeDocxjsCustomText(str, list) {
    let _srt = "";
    let i = 0;
    for (const item of str) {
      if (item === "@") {
        _srt += list[i];
        i += 1;
      } else {
        _srt += item;
      }
    }
    return _srt;
  }
  /* //
  makeDocxjsImage(name, w, h) {
    const image = new ImageRun({
      data: Buffer.from(name, "base64"),
      transformation: {
        width: w,
        height: h,
      },
    });
    return image;
  } */
  // Method which return formatted main document title
  buildTitle() {
    const string = `${this.projectTitle}`;
    const lowerString = string.toLowerCase();
    const resultString =
      lowerString.charAt(0).toUpperCase() + lowerString.slice(1);
    return resultString;
  }
  // Method wich return informations from landing page
  nomenclatureHmi() {
    const conceptionList = ["HMI", "PLC", "CAN"];
    const firstRow = ["Denomination", "Ref", "Provider", "Qtty"];
    const table = this.list(firstRow);
    for (const item of conceptionList) {
      const rows = this.list();
      for (const value of Object.values(
        this.proface.PROFACE[this.HMI_id][item]
      )) {
        rows.push(value);
      }
      rows.push(this.group);
      table.push(rows);
    }
    return table;
  }
  // Method wich return table of table representing the modules nomenclature
  nomenclatureModule(obj) {
    // obj param must be a module list ex :{moduleN:0 ...}
    const firstRow = ["Ref", "Provider", "Description", "Qtty"];
    const table = this.list(firstRow);
    for (const [key, value] of Object.entries(obj)) {
      if (value !== 0) {
        const rows = this.list();
        rows.push(this.proface.PROFACE[key]["Reference"]);
        rows.push(this.proface.PROFACE[key]["Manufacturer"]);
        rows.push(this.proface.PROFACE[key]["Description"]);
        // Qty of module can only be a str for display in wordx function
        rows.push(`${value}`);
        table.push(rows);
      }
    }
    return table;
  }
  // Method which return table according matrix parameter
  docxTable(matrix, span) {
    const result = this.list();
    for (const [key, value] of Object.entries(matrix)) {
      const row = new TableRow({
        children: [],
      });
      if (typeof value === "string") {
        row.root.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: value,
                    bold: true,
                    font: "Calibri",
                    size: 24,
                    color: "2E2E2E",
                  }),
                ],
              }),
            ],
            columnSpan: span,
            verticalAlign: VerticalAlign.BOTTOM,
          })
        );
        result.push(row);
      } else {
        for (const item of value) {
          row.root.push(
            new TableCell({
              children: [
                key === "0"
                  ? new Paragraph({
                      children: [
                        new TextRun({
                          text: item,
                          bold: true,
                          font: "Calibri",
                          size: 22,
                          color: "2E2E2E",
                        }),
                      ],
                    })
                  : new Paragraph({
                      children: [
                        new TextRun({
                          text: item === 0 ? "0" : item,
                          font: "Calibri",
                          size: 20,
                          color: "2E2E2E",
                        }),
                      ],
                    }),
              ],
              verticalAlign: VerticalAlign.BOTTOM,
            })
          );
        }
        result.push(row);
      }
    }
    return result;
  }
  // Method which build title rank 1 (DocxJs) A VIRER !!
  titleRank1(text) {
    let title = `Material architecture under HMI`;
    if (text) {
      title = `Material architecture under HMI N°${text}`;
    }
    const result = new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: false,
      alignment: AlignmentType.CENTER,
    });
    return result;
  }
  // Method which build title rank 1 (DocxJs) A UTILISER !!
  makeTitleRankOne(text) {
    const result = new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: false,
      alignment: AlignmentType.CENTER,
    });
    return result;
  }
  // Method which build title rank 2 (DocxJs)
  titleRank2(key, text) {
    let title = `module line-up`;
    if (text) {
      title =
        key !== "MAIN"
          ? `Grp ${text} - Module line-up for ${key}`
          : `Grp ${text} - ${key} module line-up`;
    }
    const result = new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: false,
      alignment: AlignmentType.CENTER,
    });
    return result;
  }
  // Method which build pre formated title when grp is empty (DocxJs)
  noTitle() {
    const result = new Paragraph({
      text: this.titleEmptyGrp,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: false,
      alignment: AlignmentType.CENTER,
    });
    return result;
  }
  // Method which build architecture under table shape for each array given in parameters
  makeTable(array, tagList) {
    const table = new Table({
      rows: [
        // Call method which build array text
        new TableRow({
          children: this.makeRowText(array, this.ref),
        }),
        // Call method which build array image
        new TableRow({
          children: this.makeRowImage(array, this.img),
        }),
        // Call methods which build array list of input output
        new TableRow({
          children: this.makeRowList(array, this.ioList, tagList),
        }),
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
        /* size: 100,
        type: WidthType.PERCENTAGE, */
      },
    });
    return table;
  }
  // Sub method which fill TableCell children with text (only for tableShapeArchitecture method)
  makeRowText(array, target) {
    const _list = this.list();
    for (const module of array) {
      const text = `${this.proface.PROFACE[module][target]}`;
      _list.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  bold: this.bold,
                  font: this.font,
                  size: this.size,
                  color: this.color,
                }),
              ],
            }),
          ],
          width: {
            size: 1,
            type: WidthType.PERCENTAGE,
            /* size: 100,
            type: WidthType.PERCENTAGE, */
          },
        })
      );
    }
    return _list;
  }
  // Sub method which fill TableCell children with image (only for tableShapeArchitecture method)
  makeRowImage(array, target) {
    const _list = this.list();
    for (const module of array) {
      const imageNumber = this.proface.PROFACE[module][target];
      _list.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: Buffer.from(this.imgList[imageNumber], "base64"),
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
            /* size: 100,
            type: WidthType.PERCENTAGE, */
          },
          verticalAlign: VerticalAlign.CENTER,
        })
      );
    }
    return _list;
  }
  // Sub method which fill TableCell children with bullet point (only for tableShapeArchitecture method)
  makeRowList(array, target, tagList) {
    const _list = this.list();
    for (const module of array) {
      const moduleIOList = this.proface.PROFACE[module][target];
      _list.push(this.attribTagToRowList(moduleIOList, tagList));
    }
    return _list;
  }
  // Pick tag to dictionnary tag and fill list according module size
  attribTagToRowList(moduleIoList, tagList) {
    const _list = this.list();
    for (const [key, value] of Object.entries(moduleIoList)) {
      if (value !== 0) {
        for (let i = 0; i < value; i++) {
          const tag =
            tagList[key].length > 0 ? tagList[key].shift() : this.noSlot;
          _list.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: tag,
                  bold: this.bold,
                  font: this.font,
                  size: this.size,
                  color:
                    key in this.colorPanel ? this.colorPanel[key] : this.color,
                }),
              ],
            })
          );
        }
      }
    }
    const rowList = new TableCell({
      children: _list,
      width: {
        size: 1,
        type: WidthType.PERCENTAGE,
        /* size: 100,
        type: WidthType.PERCENTAGE, */
      },
    });

    return rowList;
  }
  // Sub method which fill TableCell children with space (only for tableShapeArchitecture method)
  makeText(text = "", a = 50, b = 50) {
    const paragraph = new Paragraph({
      text: text,
      spacing: {
        after: a,
        before: b,
      },
    });
    return paragraph;
  }
  // Generate page break before
  makePagebreak() {
    const pageBreak = new Paragraph({
      text: "",
      pageBreakBefore: true,
    });
    return pageBreak;
  }
}
// Class wich provide several method used to build adressTable document
export class AdressTableDocBuilder extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.targetA = "IoList";
    this.targetB = "Reference";
    this.comment = "...";
    this.firstRowUK = [
      "Track N°",
      "Function",
      "Tag",
      "Type",
      "Description",
      "Board Ref",
    ];
    this.firstRowFR = [
      "N° Voie",
      "Fonction",
      "Repere",
      "Nature",
      "Description",
      "Ref carte",
    ];
  }
  // Pick tag to dictionnary tag and fill list according module size
  attribTagToList(tagList, idList, module, flag, moduleNbs) {
    const _list = this.list();
    _list.push(flag === "uk" ? this.firstRowUK : this.firstRowFR);
    const moduleIOList = this.proface.PROFACE[module][this.targetA];
    const moduleRef = this.proface.PROFACE[module][this.targetB];
    for (const [key, value] of Object.entries(moduleIOList)) {
      if (value !== 0) {
        for (let i = 0; i < value; i++) {
          // Object with duplicate {name : number}
          const counterObject = this.countDuplicateInList(tagList[key]);
          // Number of duplicate leaving for actual tag
          const actualTag = tagList[key][0];
          const counter = counterObject[actualTag];
          // Shift tag one by one
          const tag =
            tagList[key].length > 0 ? tagList[key].shift() : this.noSlot;
          const id = idList[key].length > 0 ? idList[key].shift() : this.noSlot;
          const fluf = this.AddFlufToRawAdressTable(id, key, flag, counter);
          const trackNbs = this.AddTrackNumberToRawAdressTable(
            key,
            moduleNbs,
            i
          );
          _list.push([trackNbs, fluf, tag, key, this.comment, moduleRef]);
        }
      }
    }
    return _list;
  }
  // Method which count duplicate in given list
  countDuplicateInList(list) {
    const counts = {};
    list.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
  }
  //
  reshapeTagList(tagList, idList, module, flag, moduleNbs) {
    const result = this.attribTagToList(
      tagList,
      idList,
      module,
      flag,
      moduleNbs
    );
    const _list = this.list();
    for (const item of result) {
      _list.push(item);
    }
    return _list;
  }
  //
  AddFlufToRawAdressTable(id, key, flag, counter) {
    const dataType = typeof this.private[id]["Text"][flag][key];
    if (dataType === "string") {
      return this.private[id]["Text"][flag][key];
    }
    const fluf = this.private[id]["Text"][flag][key][counter - 1];
    return fluf;
  }
  //
  AddTrackNumberToRawAdressTable(key, moduleNbs, i) {
    const track = `${moduleNbs}/${key}-${i + 1}`;
    return track;
  }
}
export class AfDocBuilder extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.cell = "IoList";
  }
  // Generate table of content ... WIP
  tableOfContents() {
    const result = new TableOfContents("Summary", {
      hyperlink: true,
      headingStyleRange: "1-5",
    });
    return result;
  }
  // Method which build title rank x for AF (DocxJs)
  makeAfTitleRankX(text, x = 1) {
    const tSize = {
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4,
    };
    const result = new Paragraph({
      text: text,
      heading: tSize[x],
      thematicBreak: false,
      pageBreakBefore: x === 1 ? true : false,
      alignment: AlignmentType.START,
    });
    return result;
  }
  // Method which build text with parameters for AF (DocxJs)
  makeAfText(text, b = false, f = "Calibri", s = 12, c = "2E2E2E") {
    const paragraph = new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: b,
          font: f,
          size: s,
          color: c,
        }),
      ],
    });
    return paragraph;
  }
  // Method which return pre-formated table according matrix parameter => [[title],[col,col,col]...]
  makeAfTable(matrix) {
    const span = matrix[1].length;
    const table = new Table({
      columnWidths: [],
      rows: [],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
    // Loop through given matrix
    matrix.forEach((element, key) => {
      const row = new TableRow({
        children: [],
      });
      element.forEach((item) => {
        row.root.push(
          new TableCell({
            children: [
              key === 0
                ? this.makeAfText(item, true, "Calibri", 18, "2E2E2E")
                : key === 1
                ? this.makeAfText(item, true, "Calibri", 14, "2E2E2E")
                : this.makeAfText(item),
            ],
            columnSpan: key === 0 ? span : 0,
          })
        );
      });
      table.root.push(row);
    });
    return table;
  }
  // Method which build pre-formatted object => obj = {categorie:{}
  makeBasisObjectForAf() {
    const _obj = this.object();
    for (const value of Object.values(this.infosElement)) {
      _obj[value.categorie] = this.object();
    }
    return _obj;
  }
  // Method which build pre-formatted object => obj = {categorie:{generic name:[]}}
  makeAssignationObj() {
    const _obj = this.makeBasisObjectForAf();
    for (const value of Object.values(this.infosElement)) {
      _obj[value.categorie][value.name] = this.list();
    }
    return _obj;
  }
  // Method which fill this pre-formatted object with tuple => [id,tag]
  makeWorkingBasisObjectForAf() {
    const _obj = this.makeAssignationObj();
    for (const value of Object.values(this.infosElement)) {
      _obj[value.categorie][value.name].push([value.id, value.tag]);
    }
    //console.log();
    return _obj;
  }
  // Method which re arrange raw tag only for part B in AF
  makeAfBullet(tagList, d = 0, b = false, f = "Calibri", s = 12, c = "2E2E2E") {
    const _list = this.list();
    const errorText = "NONE";
    for (const item of tagList) {
      const bulletText = `${item[0]}=>${item[1]}`;
      _list.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.length !== 2 ? errorText : bulletText,
              bold: b,
              font: f,
              size: s,
              color: c,
            }),
          ],
          bullet: {
            level: d,
          },
        })
      );
    }
    return _list;
  }
  // Method which re arrange raw tag only for FB in AF
  makeAfFbBullet(
    bullet,
    d = 0,
    b = false,
    f = "Calibri",
    s = 12,
    c = "2E2E2E"
  ) {
    const _list = this.list();
    for (const item of bullet) {
      const text = item[0];
      _list.push(
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              bold: b,
              font: f,
              size: s,
              color: c,
            }),
          ],
          bullet: {
            level: d,
          },
        })
      );
    }
    return _list;
  }
  // Method which build control and command table according infos inside private JSON
  makeAfCustomTable(tList, firstRow, flag) {
    const _matrix = this.list();
    const unique = this.multiDimensionalUnique(tList);
    for (const item of unique) {
      const id = item[0];
      const tag = item[1];
      const table = this.list([tag]);
      table.push(firstRow);
      for (const [key, value] of Object.entries(this.private[id]["IO"])) {
        for (let i = 0; i < value; i++) {
          const size = this.private[id]["AF"][flag][key][i].length;
          if (size !== 0) {
            const data = this.private[id]["AF"][flag][key][i];
            table.push(this.buildCompleteArray(i, key, data));
            // Attention ! Erreur possible si IOList ne correspond pas avec la taille de la liste de liste de text correspondante
          }
        }
      }
      _matrix.push(table);
    }
    //console.log("matrice", _matrix);  //(to keep for debug)
    return _matrix;
  }

  // Method which remove duplicates from a two-dimensional array
  multiDimensionalUnique(arr) {
    var uniques = this.list();
    var itemsFound = this.object();
    for (var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }
  // Method which add key and number to control and command table
  buildCompleteArray(i, key, data) {
    const newData = [...data];
    newData.splice(1, 0, key);
    newData.splice(2, 0, i + 1);
    return newData;
  }
  // Method which build control and command table according infos inside private JSON
  makeAfFaultTable(tList, firstRow, flag) {
    const _matrix = this.list();
    const unique = this.multiDimensionalUnique(tList);
    for (const item of unique) {
      const id = item[0];
      const tag = item[1];
      const table = this.list([tag]);
      table.push(firstRow);
      const size = this.private[id]["FAULTS"][flag].length;
      if (size > 2) {
        for (let i = 0; i < this.private[id]["FAULTS"][flag].length; i++) {
          table.push(this.private[id]["FAULTS"][flag][i]);
        }
      } else {
        table.push(["NONE", "NONE", "NONE"]);
      }
      _matrix.push(table);
    }
    return _matrix;
  }
  // Method which build list with exact number of function bloc used in this project
  makeFunctionBlocList() {
    const fbList = this.list();
    for (const item of this.infosElement) {
      const scanFb = this.private[item.id]["FunctionBloc"];
      if (scanFb !== false) {
        fbList.push(scanFb);
      }
    }
    return [...new Set(fbList)];
  }
  // Method which check if element have a function block assigned
  checkFb(id) {
    const checkFb = this.private[id]["FunctionBloc"];
    return checkFb;
  }
}
