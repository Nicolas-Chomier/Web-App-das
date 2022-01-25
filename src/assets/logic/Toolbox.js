import {
  Table,
  TableRow,
  TableCell,
  Paragraph,
  VerticalAlign,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
} from "docx";
import privates from "../data/private.json";
import proface from "../data/proface.json";

// Class wich regroup methods used to build documents //
export class DocumentTools {
  constructor(rawAbstract) {
    // Load special datas (private info and technical infos)
    this.private = JSON.parse(JSON.stringify(privates));
    this.proface = JSON.parse(JSON.stringify(proface));
    // Datas from Landing page
    this.coef = rawAbstract.Project.Coef;
    this.group = rawAbstract.Project.Option;
    this.title = rawAbstract.Project.Title;
    this.openAir = rawAbstract.Project.Option2;
    this.HMI_id = rawAbstract.Project.Technology.id;
    // Elements list from PanelsPage
    this.dataset = rawAbstract.Elements;
    // Class variable:
    // Open air identification
    this.flag = "OPA";
    // !! -- List of different type of input output hardware -- !! //
    this.hwl = ["ni", "no", "ai", "ao", "ti"];
    // Mandatory reserved slot attribute to each project //
    this.rsl = { ni: 8, no: 6, ai: 1, ao: 0, ti: 0 };
    // Name for reserved slot
    this.rname = "Reserved";
  }
  // ** Basic brick ** //
  // Method wich return empty Object
  object() {
    const _obj = {};
    for (const prop of Object.getOwnPropertyNames(_obj)) {
      delete _obj[prop];
    }
    return _obj;
  }
  // Method wich return an formatted empty structure
  skeleton() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = {
        ni: [],
        no: [],
        ai: [],
        ao: [],
        ti: [],
      };
    }
    return obj;
  }
  // Method wich return an formatted empty structure only to use with dictionnaryWithIO method
  skeletonSpecial() {
    const obj = this.object();
    for (let i = 0; i < this.group; i++) {
      obj[i + 1] = { MAIN: "" };
    }
    return obj;
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
  // ** Advanced function ** //
  // Method which return formatted main document title
  Buildtitle() {
    const string = `${this.title}`;
    const lowerString = string.toLowerCase();
    const resultString =
      lowerString.charAt(0).toUpperCase() + lowerString.slice(1);
    return resultString;
  }
  // Method which return fullfilled dictionnary with all item's tag stored correctly
  rawDictionnary() {
    const structure = this.skeleton();
    const dataset = this.dataset;
    let j = 1;
    for (const item of dataset) {
      const name = item.name;
      const grp = item.group;
      for (const [key, value] of Object.entries(structure)) {
        // For each group ...
        if (key === grp) {
          // If open air compressors are present in wish list or not:
          if (name !== this.flag) {
            // Adding corresponding item tag list
            structure[key] = this.addItem(item, value);
          } else {
            // Or adding open air tag list
            structure[key][`CP0${j}`] = this.addOpenAir(item);
            j += 1;
          }
        }
      }
    }
    return structure;
  }
  // Method which build item tag structure and add it to main dictionnary (run only with rawDictionnary method)
  addItem(item, value) {
    const prv = this.private;
    const tag = item.tag;
    const niNbs = prv[item.id]["ni"];
    const noNbs = prv[item.id]["no"];
    const aiNbs = prv[item.id]["ai"];
    const aoNbs = prv[item.id]["ao"];
    const tiNbs = prv[item.id]["ti"];
    for (let i = 0; i < niNbs; i++) {
      value.ni.push(tag);
    }
    for (let i = 0; i < noNbs; i++) {
      value.no.push(tag);
    }
    for (let i = 0; i < aiNbs; i++) {
      value.ai.push(tag);
    }
    for (let i = 0; i < aoNbs; i++) {
      value.ao.push(tag);
    }
    for (let i = 0; i < tiNbs; i++) {
      value.ti.push(tag);
    }
    return value;
  }
  // Method which build open air tag structure and add it to main dictionnary (run only with rawDictionnary method)
  addOpenAir(item) {
    const prv = this.private;
    const structure = {
      ni: [],
      no: [],
      ai: [],
      ao: [],
      ti: [],
    };
    const tag = item.tag;
    const niNbs = prv[item.id]["ni"];
    const noNbs = prv[item.id]["no"];
    const aiNbs = prv[item.id]["ai"];
    const aoNbs = prv[item.id]["ao"];
    const tiNbs = prv[item.id]["ti"];
    for (let i = 0; i < niNbs; i++) {
      structure.ni.push(tag);
    }
    for (let i = 0; i < noNbs; i++) {
      structure.no.push(tag);
    }
    for (let i = 0; i < aiNbs; i++) {
      structure.ai.push(tag);
    }
    for (let i = 0; i < aoNbs; i++) {
      structure.ao.push(tag);
    }
    for (let i = 0; i < tiNbs; i++) {
      structure.ti.push(tag);
      //value.ti.push(tag);
    }
    return structure;
  }
  // Method used to add mandatory slots to standard dictionnary (default grp 1)
  dictionnaryWithTag(grp = 1) {
    //amelioration possible en autorisant tt les group a avoir des mandatory slot !!
    const _obj = this.rawDictionnary();
    // Security against bad group number:
    if (grp > this.group || grp <= 0) {
      grp = 1;
    }
    // Fill choosen group with reserved slot:
    for (const [key, value] of Object.entries(_obj[grp])) {
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
  dictionnaryWithIO(dictionnary) {
    const size = Object.keys(dictionnary).length; // Get number of groups
    const _result = this.skeletonSpecial(); // Create an pre formatted empty object
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
    const dataset = this.dataset;
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
    const dataset = this.dataset;
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
export class Proface {
  constructor() {
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
    const _list = [];
    _list.length = 0;
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
    const _list = [];
    _list.length = 0;
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
    const _list = [];
    _list.length = 0;
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
export class docxBuilder {
  constructor() {
    this.proface = JSON.parse(JSON.stringify(proface));
    //
    this.titleEmptyGrp = "No item has been selected";
    // Conception of architecture table shape itself
    this.tableStepType = ["Reference", "Img", "Manufacturer"];
  }
  // Method which return table according matrix parameter
  docxTable(matrix) {
    const result = [];
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
                        text: item,
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
  // Method which return Title + table builded for architecture
  architectureBloc() {
    //const _list = [];
    /* new Paragraph({
      text: conf.title1,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: false,
      alignment: AlignmentType.CENTER,
    }),
   // ARCH
    new Table({
      columnWidths: [2500, 2800, 7000, 2000],
      rows: "table1",
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    }), */
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
  tableShapeArchitecture(array) {
    const ref = this.tableStepType[0];
    const img = this.tableStepType[1];
    const list = this.tableStepType[2];
    console.log("ref");
    const row1 = this.TableCellArchitecture(array, ref);
    console.log("image");
    const row2 = this.TableCellArchitecture(array, img);
    console.log("list");
    const row3 = this.TableCellArchitecture(array, list);
    //
    const table = new Table({
      columnWidths: [3505, 5505],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Hello")],
            }),
            new TableCell({
              width: {
                size: 5505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Hello")],
            }),
          ],
        }),
        new TableRow({
          children: row2,
        }),
        new TableRow({
          children: row3,
        }),
      ],
    });
    return table;
  }
  // Sub method which fill TableCell children (only for tableShapeArchitecture method)
  TableCellArchitecture(array, target) {
    const _list = [];
    // `${this.proface.PROFACE[module][target]}`
    _list.length = 0;
    for (const module of array) {
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiii", module, target);
      _list.push(
        new TableCell({
          width: {
            size: 3505,
            type: WidthType.DXA,
          },
          children: [new Paragraph(`${this.proface.PROFACE[module][target]}`)],
        })
      );
    }
    return _list;
  }
}
