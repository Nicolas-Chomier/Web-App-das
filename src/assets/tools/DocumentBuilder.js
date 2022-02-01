import { Buffer } from "buffer";
import { Table, TableRow, TableCell } from "docx";
import { Paragraph, TextRun } from "docx";
import { HeadingLevel, VerticalAlign, AlignmentType, WidthType } from "docx";
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
export default class DocumentBuilder {
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
    this.hwl = ["ni", "no", "ai", "ao", "ti"];
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
}
// Class wich regroup methods used to build documents //
export class DataArrangement extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.flag = "OPA"; // Identification word for an Open Air compressor
    this.rsl = { ni: 8, no: 6, ai: 1, ao: 0, ti: 0 }; // Mandatory reserved slot attribute to each project
    this.rname = "Reserved"; // Tag used to fill reserved slot
  }
  // Method wich return an formatted empty structure only to use with dictionnaryWithIO method
  skeletonIoList() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = { MAIN: "" };
    }
    return obj;
  }
  // Method wich return an formatted empty structure only to use with dictionnaryWithTag method
  skeletonTagList() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = { MAIN: this.emptyTagList() };
    }
    return obj;
  }
  // Method which return fullfilled dictionnary with all item's tag stored correctly
  rawDictionnary() {
    const structure = this.skeletonTagList();
    let j = 1;
    for (const item of this.infosElement) {
      if (item.name !== this.flag) {
        for (const [key, value] of Object.entries(this.private[item.id])) {
          if (value !== 0) {
            for (let i = 0; i < value; i++) {
              structure[item.group]["MAIN"][key].push(item.tag);
            }
          }
        }
      } else {
        structure[item.group][`CP0${j}`] = this.emptyTagList();
        for (const [key, value] of Object.entries(this.private[item.id])) {
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
    const _obj = this.rawDictionnary();
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
          value.unshift(this.rname);
        }
      }
    }
    return _obj;
  }
  // Method which build IOList under dictionnary shape for each group, add coef and reserved slot (Take care to use reserved dictionnary !)
  ioListObject(dictionnary) {
    const size = Object.keys(dictionnary).length; // Get number of groups
    const _result = this.skeletonIoList(); // Create an pre formatted empty object
    // For each group in dictionnary ...
    for (let i = 1; i < size + 1; i++) {
      // Build item IOList from a new empty one
      const _obj = this.emptyIolist();
      // for each type of device (ni, no ...) ...
      for (const key of Object.keys(dictionnary[i])) {
        // Only key in HWL list are accepted
        if (this.hwl.includes(key)) {
          // Only for group 1 (the main group)
          if (i === 1) {
            // Device (tag list) length minus mandatory reserved slots
            const rawNbs = dictionnary[i][key].length - this.rsl[key];
            // Apply incertitude coef to tag list (without mandatory reserved slots)
            _obj[key] += Math.round(rawNbs * this.coef);
            // Add mandatory reserved slots to IOList device
            _obj[key] += this.rsl[key];
            // Put this fullfilled IOList to a main object
            //console.log("===", _result[i], "===", _obj);
            _result[i]["MAIN"] = _obj;
          } else {
            // Apply incertitude coef to tag list
            _obj[key] += Math.round(dictionnary[i][key].length * this.coef);
            // Put this fullfilled IOList to a main object
            _result[i]["MAIN"] = _obj;
          }
        } else {
          const _obj = this.emptyIolist();
          for (const bkey of Object.keys(_obj)) {
            _obj[bkey] += dictionnary[i][key][bkey].length;
            _result[i][key] = _obj;
          }
        }
      }
    }
    return _result;
  }
  // Method which build one main object with global IOList (obsolete ?)
  ioListAdder(obj) {
    const elementIoList = { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 };
    for (let i = 0; i < Object.keys(obj).length; i++) {
      for (const [key, value] of Object.entries(obj[i + 1])) {
        if (typeof value === "number") {
          elementIoList[key] += value;
        }
      }
    } // a refaire en partant de const dataset = this.dataset;
    return elementIoList;
  }
  // Method wich build full elements IOList with reserved slot and incertitude coef (both in option)
  ioListBuilder(coef = true, slot = true) {
    const dataset = this.infosElement;
    const prv = this.private;
    const _ioList = this.emptyIolist();
    for (const item of dataset) {
      if (item.name !== this.flag) {
        // Fill emptyIolist with item in dataset according hardware input output type
        for (const tag of this.hwl) {
          _ioList[tag] += prv[item.id][tag];
        }
      }
    }
    //console.log("raw iolist--------------", _ioList);
    // Apply coef if true
    if (coef) {
      this.addCoef(_ioList);
    }
    //console.log("iolist + coef--------------", _ioList);
    // Add slots if true
    if (slot) {
      this.addSlot(_ioList);
    }
    //console.log("iolist + reserved slot---------------", _ioList);
    return _ioList;
  }
  // Method wich add incertitude coeficient to raw IOList (run only with ioListBuilder method)
  addCoef(_obj) {
    for (const [key, value] of Object.entries(_obj)) {
      _obj[key] = Math.round(value * this.coef);
    }
    return false;
  }
  // Method wich add incertitude coeficient to main IOList (run only with ioListBuilder method)
  addSlot(_obj) {
    for (const key of Object.keys(_obj)) {
      _obj[key] += this.rsl[key];
    }
    return false;
  }
  // Method which return module nomenclature only for Open air compressor setup
  openAirModule() {
    const dataset = this.infosElement;
    const prv = this.private;
    const _list = this.list();
    // Open air builded model mudule list
    const moduleList = {
      module2: 0,
      module4: 0,
      module9: 0,
      module10: 0,
    };
    // Fill list with capitale letter which represent de type of open air compressors
    for (const item of dataset) {
      if (
        item.name === this.flag &&
        prv[item.id].hasOwnProperty("type") === true
      ) {
        _list.push(prv[item.id].type);
      }
    }
    // Open air module list incrementation
    for (const letter of _list) {
      if (letter === "A") {
        moduleList.module2 += 1;
        moduleList.module4 += 1;
        moduleList.module10 += 1;
      } else {
        moduleList.module2 += 1;
        moduleList.module4 += 1;
        moduleList.module10 += 1;
        moduleList.module9 += 1;
      }
    }
    return moduleList;
  }
  // Method which merge module main line with open air module line (care to parameter orders (big object in 1 small in 2))
  mergeModuleLine(ob1, ob2) {
    let _obj = this.object();
    Object.keys(ob1).forEach((key) => {
      if (ob2.hasOwnProperty(key)) {
        _obj[key] = ob1[key] + ob2[key];
      } else {
        _obj[key] = ob1[key];
      }
    });
    return _obj;
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
    let ni = target.ni;
    let ri = ni % this.nMax;
    let no = target.no;
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
  // Method wich calcul the numbers of analog proface module selection according given IOList
  analogModule(target) {
    const analogResult = { module6: 0, module7: 0, module8: 0, module9: 0 };
    let ai = target.ai;
    let ao = target.ao;
    let ti = target.ti;
    let ri = ai % this.nMax;
    let ro = ao % this.nMax;
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
    analogResult.module8 += Math.floor(ao / this.aMax);
    if (ro !== 0) {
      if (ro > this.aMin) {
        analogResult.module8 += 1;
        _output += this.aMax - ro;
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
    // Shape of IOList needed { ni: *, no: *, ai: *, ao: *, ti: * }
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
}
// Class wich provide several method to design and build word document
export class docxBuilder extends DocumentBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.titleEmptyGrp = "No item has been selected";
    // Variable used for make the shape of the architecture document
    this.ref = "Reference";
    this.img = "Img";
    this.ioList = "IoList";
    // Name put in input output module list when no correspondance in tag list
    this.noSlot = "Spare";
    // Image list for proface module
    this.imgList = [IM1, IM1, IM2, IM3, IM4, IM5, IM6, IM7];
    // Displayed text configuration
    this.bold = false;
    this.font = "Calibri";
    this.size = 18;
    this.color = "2E2E2E";
    // Color attribution depending of input or output type
    this.colorPanel = {
      ni: "30FF18",
      no: "2CC132",
      ai: "1CD2FF",
      ao: "1C87FF",
      ti: "FFB01C",
    };
  }
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
  // Method which build table IOList for all element
  buildElementsIolistTable() {
    const prv = this.private;
    //console.log(prv);
    const firstRow = [
      "N°",
      "Name",
      "Type",
      "Numeric Input",
      "Numeric Output",
      "Analog Input",
      "Analog Output",
      "T° Input",
    ];
    const table = this.list(firstRow);
    for (const [key, value] of Object.entries(this.infosElement)) {
      const _list = this.list();
      _list.push(key);
      _list.push(value.name);
      _list.push(prv[value.id].type);
      _list.push(prv[value.id].ni);
      _list.push(prv[value.id].no);
      _list.push(prv[value.id].ai);
      _list.push(prv[value.id].ao);
      _list.push(prv[value.id].ti);
      table.push(_list);
    }
    return table;
  }
  // Method which return table according matrix parameter
  docxTable(matrix) {
    const result = this.list();
    for (const [key, value] of Object.entries(matrix)) {
      const row = new TableRow({
        children: [],
      });
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
    return result;
  }
  // Method which build title rank 1 (DocxJs)
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
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
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
          width: {
            size: 1000,
            type: WidthType.AUTO,
          },
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
          width: {
            size: 1000,
            type: WidthType.AUTO,
          },
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
          verticalAlign: VerticalAlign.CENTER,
        })
      );
    }
    return _list;
  }
  // Sub method which fill TableCell children with bullet point (only for tableShapeArchitecture method)
  makeRowList(array, target, tagList) {
    console.log("pop!", tagList);
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
      console.log("attribTagToRowList", key, value);
      if (value !== 0) {
        for (let i = 0; i < value; i++) {
          const tag =
            tagList[key].length > 0 ? tagList[key].shift() : this.noSlot;
          console.log("pop tag", tag);
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
      width: {
        size: 1000,
        type: WidthType.AUTO,
      },
      children: _list,
    });
    return rowList;
  }
  // Sub method which fill TableCell children with space (only for tableShapeArchitecture method)
  makeRowSpace(text = "") {
    const paragraph = new Paragraph({
      text: text,
      spacing: {
        after: 50,
        before: 50,
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
