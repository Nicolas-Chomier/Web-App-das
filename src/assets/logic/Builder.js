import privates from "../data/private.json";
import device from "../data/device.json";

// Class wich build tag architecture //
export class Architecture {
  constructor(rawAbstract) {
    // Load private datas
    this.data_privates = JSON.parse(JSON.stringify(privates));
    // Load datas from FRONT
    this.data_elements = rawAbstract.Elements;
    this.data_projects = rawAbstract.Project;
  }
  // Method wich return empty Object //
  object() {
    const _obj = {};
    for (const prop of Object.getOwnPropertyNames(_obj)) {
      delete _obj[prop];
    }
    return _obj;
  }
  // Method wich return an empty structure for stock tag, according item project list choosen //
  skeleton() {
    const nbs = this.data_projects.Option;
    const obj = this.object();
    for (let i = 0; i < nbs; i++) {
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
  // Method wich return fullfilled dictionnary with all item's tag stored correctly //
  dictionnary() {
    const structure = this.skeleton();
    const dataset = this.data_elements;
    // Open air identifacation flag & number:
    const flag = "OPA";
    let j = 1;
    for (const item of dataset) {
      const name = item.name;
      const grp = item.group;
      for (const [key, value] of Object.entries(structure)) {
        if (key === grp) {
          if (name !== flag) {
            structure[key] = this.addItem(item, value);
          } else {
            structure[key][`CP0${j}`] = this.addOpenAir(item);
            j += 1;
          }
        }
      }
    }
    return structure;
  }
  // Method which build open air tag structure and add it to main dictionnary //
  addOpenAir(item) {
    const prv = this.data_privates;
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
  // Method which build item tag structure and add it to main dictionnary //
  addItem(item, value) {
    const prv = this.data_privates;
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
  // Method used to add basical project needs to standard dictionnary //
  reservedDictionnary(grp = 1) {
    const _obj = { ...this.dictionnary() };
    const nbs = this.data_projects.Option;
    // Project reserved slot config:
    const prs = { ni: 8, no: 6, ai: 1, ao: 0, ti: 0 };
    const name = "Reserved";
    // Security against bad group number:
    if (grp > nbs || grp <= 0) {
      grp = 1;
    }
    // Fill choosen group with reserved slot:
    for (const [key, value] of Object.entries(_obj[grp])) {
      //console.log("====", key, value); // Keep to understand or debug
      // Avoid Open Air compressor line
      if (key in prs === true) {
        for (let i = 0; i < prs[key]; i++) {
          value.unshift(name);
        }
      }
    }
    return _obj;
  }
}

// Class wich build IOList //
export class IOList {
  constructor(dictionnary) {
    // Load builded dictionnary
    this.dataset = dictionnary;
  }
  // Method which build the main IOList project (raw) //
  rawList() {
    const dictionnary = this.dataset;
    const size = Object.keys(dictionnary).length;
    const _obj = { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 };
    for (let i = 1; i < size + 1; i++) {
      _obj["ni"] += dictionnary[i]["ni"].length;
      _obj["no"] += dictionnary[i]["no"].length;
      _obj["ai"] += dictionnary[i]["ai"].length;
      _obj["ao"] += dictionnary[i]["ao"].length;
      _obj["ti"] += dictionnary[i]["ti"].length;
    }
    return _obj;
  }
  // Method which return IOList with input ouput open air requisit //
  OpenAirList(i = 1) {
    const dictionnary = this.dataset;
    const raw = { ...this.rawList() };
    for (const key of Object.keys(dictionnary[i])) {
      if (key in raw === false) {
        raw["ni"] += dictionnary[i][key]["ni"].length;
        raw["no"] += dictionnary[i][key]["no"].length;
        raw["ai"] += dictionnary[i][key]["ai"].length;
        raw["ao"] += dictionnary[i][key]["ao"].length;
        raw["ti"] += dictionnary[i][key]["ti"].length;
      }
    }
    return raw;
  }

  // Method which return IOList with gap coef (k) applied //
  coefList(k) {
    const _ioList = this.rawList();
    const _obj = { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 };
    for (const [key, value] of Object.entries(_ioList)) {
      _obj[key] += Math.round(value * k);
    }
    return _obj;
  }
}

// Class
export class Proface {
  constructor() {
    // Load technical datas
    this.data_proface = JSON.parse(JSON.stringify(device));
  }
  // Method wich return empty List //
  list() {
    const _list = [];
    _list.length = 0;
    return _list;
  }
  //
}
