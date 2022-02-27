import privates from "../../data/private.json";

const privateDatas = JSON.parse(JSON.stringify(privates));

class MainDataSetBuilder {
  constructor(rawAbstract) {
    this.infosElement = rawAbstract.Elements;
    this.coef = rawAbstract.Project.Coef;
    this.emptyIoListModel = { DI: 0, DO: 0, AI: 0, AO: 0, AIt: 0 };
    // Main list configuration for different type of input output hardware
    this.hwl = ["DI", "DO", "AI", "AO", "AIt"];
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
  // Method which return an formatted empty structure only to use with dictionnaryWithIO method
  emptyShapeForIolist() {
    const obj = this.object();
    obj["MAIN"] = this.emptyIolist();
    return obj;
  }
  // Method which return an formatted empty structure only to use with dictionnaryWithTag method
  emptyShapeForTagList() {
    const obj = this.object();
    obj["MAIN"] = { MAIN: this.emptyTagList() };
    return obj;
  }
  // Method which delete duplicate in front elements list (tag is unique)
  removeAbstractDuplicate() {
    const uniqueObjects = [
      ...new Map(this.infosElement.map((item) => [item.tag, item])).values(),
    ];
    return uniqueObjects;
  }
}

export class DataSetBuilder extends MainDataSetBuilder {
  constructor(rawAbstract) {
    super(rawAbstract);
    this.openAirItemTable = ["OPA-F", "OPA-V"];
    this.rsl = { DI: 6, DO: 4, AI: 0, AO: 0, AIt: 0 }; // Mandatory reserved slot attribute to each project
    this.rName = "Reserved"; // Tag used to fill reserved slot
    this.rId = "0000"; // Id used for reserved slot
  }
  /** */
  projectMainObjIoList(plcNative) {
    const dataSet = this.removeAbstractDuplicate();
    const modele = this.emptyShapeForIolist(); // Get the empty modele
    let j = 1; // Counter for OPEN AIR Compressor
    // Build object with sub object inside each sub Object represent an IOList
    for (const value of Object.values(dataSet)) {
      const elemIoList = privateDatas[value.id]["IO"];
      if (this.openAirItemTable.includes(value.name)) {
        const label = `CP n°${j}, (${value.name})`;
        modele[label] = this.emptyIolist();
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
    if (plcNative) {
      for (const [key, value] of Object.entries(plcNative)) {
        modele["MAIN"][key] =
          modele["MAIN"][key] - value < 0 ? 0 : modele["MAIN"][key] - value;
      }
    }
    return modele;
  }
}
