import proface from "../shared/providerInfos/proface.json";

const profaceDatas = JSON.parse(JSON.stringify(proface));

/**
 ** Mother Class with basic mandatory methods to build data structure in children class
 */
class MotherDataCreator {
  constructor(rawAbstract, flag) {
    this.privateDatas = require(`../shared/Private/${flag}-elementDataSet.json`);
    this.infosElement = rawAbstract.Elements;
    this.coef = rawAbstract.Project.Coef;
    this.hwl = ["DI", "DO", "AI", "AO", "AIt"]; // Main modele for IO list or other device
  }
  // Method which return empty Object
  object() {
    const _obj = {};
    for (const prop of Object.getOwnPropertyNames(_obj)) {
      delete _obj[prop];
    }
    return _obj;
  }
  // Method which return empty list
  list(item) {
    const _list = [];
    _list.length = 0;
    if (item) {
      _list.push(item);
    }
    return _list;
  }
  // Method which return empty IO List model based on hwl model
  emptyIolist() {
    const _obj = this.object();
    for (const item of this.hwl) {
      _obj[item] = 0;
    }
    return _obj;
  }
  // Method which return empty Tag List model based on hwl model
  emptyTagList() {
    const _obj = this.object();
    for (const item of this.hwl) {
      _obj[item] = this.list();
    }
    return _obj;
  }
  // Method which return an formatted empty structure only to use with dictionnaryWithIO method
  emptyShapeForIolist() {
    const obj = this.object();
    obj["MAIN"] = this.emptyIolist();
    return obj;
  }
  // Method which return an formatted empty structure only to use with dictionnaryWithTag method
  emptyShapeForTagList() {
    const obj = this.object();
    obj["MAIN"] = this.emptyTagList();
    return obj;
  }
  // Method which delete duplicate in front elements list (only tag is unique)
  removeAbstractDuplicate() {
    const uniqueObjects = [
      ...new Map(this.infosElement.map((item) => [item.tag, item])).values(),
    ];
    return uniqueObjects;
  }
}
/**
 ** Class generaly used to build all needed data structures
 */
export class MainDataCreator extends MotherDataCreator {
  constructor(rawAbstract, flag) {
    super(rawAbstract, flag);
    this.infosElement = rawAbstract.Elements;
    this.native = rawAbstract.Project.Technology.nativeDevice;
    this.hmiId = rawAbstract.Project.Technology.id;
    this.pTitle = rawAbstract.Project.Title;
    this.openAirItemTable = ["OPA-F", "OPA-V"]; // When Open air option is choosen, its important to filter open air compressor
    this.rsl = { DI: 6, DO: 4, AI: 0, AO: 0, AIt: 0 }; // Mandatory reserved slot attribute to each project
    this.mandatoryIdName = "Compressor-";
  }
  plcNativeIoList() {
    const nativIo = profaceDatas.PROFACE[this.hmiId]["NativeIO"];
    return nativIo;
  }
  nativeDeviceInfos() {
    const bool = typeof this.native === "boolean" ? this.native : true;
    return bool;
  }
  deviceReferenceFor(type, bool) {
    const ref = profaceDatas.PROFACE[this.hmiId][type]["Ref"];
    return bool ? ref.toUpperCase() : ref;
  }
  /**
   * Method used to get and format the main project title
   * @param bool = Uppercase if true, if not only the first letter in uppercase
   * @returns string
   */
  projectTitle(bool = true) {
    const title = this.pTitle.toLowerCase();
    if (bool) {
      return title.toUpperCase();
    }
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  /**
   * Method which build object with IOlist inside
   * @returns {MAIN: {DI: x, DO: x, AI: x, AO: x, AIt: x}, Compressor XX: {DI: x, DO: x, AI: x, AO: x, AIt: x}}
   */
  projectIoListing() {
    const dataSet = this.removeAbstractDuplicate();
    const modele = this.emptyShapeForIolist(); // Get the empty modele
    const plcNative = this.plcNativeIoList(); // Get native device IOList from choosen PLC
    let j = 1; // Counter for OPEN AIR Compressor
    // Build object with sub object inside each sub Object represent an IOList
    for (const value of Object.values(dataSet)) {
      const elemIoList = this.privateDatas[value.id]["IO"];
      if (this.openAirItemTable.includes(value.name)) {
        // Naming open air compressor
        //! a voir pour chnager le nom generic des compresseurs
        const label = `${this.mandatoryIdName}${j}`;
        modele[label] = this.emptyIolist();
        //const labelTest = value.tag
        for (const [item, numbers] of Object.entries(elemIoList)) {
          modele[label][item] += numbers;
        }
        j += 1;
      } else {
        for (const [key, value] of Object.entries(elemIoList)) {
          modele["MAIN"][key] += Math.round(value * this.coef);
        }
      }
    }
    // Add mandatory reserved slot attribute to each project
    for (const key of Object.keys(modele["MAIN"])) {
      modele["MAIN"][key] += this.rsl[key];
    }
    // Substract PLC native IOList to main IOLIst if there one
    if (typeof plcNative === "object") {
      for (const [key, value] of Object.entries(plcNative)) {
        modele["MAIN"][key] =
          modele["MAIN"][key] - value < 0 ? 0 : modele["MAIN"][key] - value;
      }
    }
    return modele;
  }
  /**
   * Method which build a set of main element used in the project
   * @param target "string", consumer name or function bloc
   * @param bool boolean if true apply toUpperCase to item
   * @returns [set of targeted item]
   */
  specialProjectListFor(target, bool = true) {
    const list = [];
    this.infosElement.forEach((element) => {
      const item = this.privateDatas[element.id][target];
      if (item) {
        list.push(bool ? item.toUpperCase() : item.toLowerCase());
      }
    });
    return [...new Set(list)];
  }
  /**
   * Method which build an object classified by family group, item name and array of couple [id,Tag]
   * @returns {Family group: {itemX:[id,tag]}}
   */
  projectTagsAndIdObject() {
    const dataSet = this.removeAbstractDuplicate();
    const obj = {};
    // {"str":{}}
    for (const value of Object.values(dataSet)) {
      obj[value.categorie] = {};
    }
    // {"str":{"str":[]}}
    for (const value of Object.values(dataSet)) {
      obj[value.categorie][value.name] = [];
    }
    // {"str":{"str":[id,tag]}}
    for (const value of Object.values(dataSet)) {
      obj[value.categorie][value.name].push([value.id, value.tag]);
    }
    return obj;
  }
  /**
   * Method which build list of unique couple [id,tag]
   * @returns [[idX,tagX],[idN,tagN]...]
   */
  projectTagsAndIdList() {
    const dataSet = this.removeAbstractDuplicate();
    const list = [];
    for (const item of dataSet) {
      list.push([item.id, item.tag]);
    }
    return list;
  }
  /**
   * Method which build an object classified by type of lineUp (MAIN or CP), with list of id/tag by input output type
   * @param target "string" tag or id
   * @returns {LineUp: {MAIN: AI: ["str"],AIt: ["str"],AO: ["str"],DI: ["str"],DO: ["str"]}
   */
  projectListingfor(target) {
    const dataset = this.removeAbstractDuplicate();
    const obj = this.emptyShapeForTagList();
    const lowTar = target.toLowerCase();
    const rSlot = lowTar === "id" ? "0000" : "Reserved";
    let j = 1;
    // Fill listing with tags
    for (const item of dataset) {
      const elemIoList = this.privateDatas[item.id]["IO"];
      // If tag belong to Main line
      if (!this.openAirItemTable.includes(item.name)) {
        for (const [key, value] of Object.entries(elemIoList)) {
          if (value) {
            for (let i = 0; i < value; i++) {
              obj["MAIN"][key].push(item[lowTar]);
            }
          }
        }
        // Tag belong to compressor Open air line
      } else {
        const label = `${this.mandatoryIdName}${j}`;
        obj[label] = this.emptyTagList();
        for (const [key, value] of Object.entries(elemIoList)) {
          if (value) {
            for (let i = 0; i < value; i++) {
              obj[label][key].push(item[lowTar]);
            }
          }
        }
        j += 1;
      }
    }
    // Fill listing with reserved slot
    for (const [key, value] of Object.entries(obj["MAIN"])) {
      if (key in this.rsl) {
        const rslv = this.rsl[key];
        for (let i = 0; i < rslv; i++) {
          value.unshift(rSlot);
        }
      }
    }
    return obj;
  }
}
