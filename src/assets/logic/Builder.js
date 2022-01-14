import privates from "../data/private.json";

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
    const prv = this.data_privates;
    const dataset = this.data_elements;
    /* const structure_test = {
      1: { ni: ["*"], no: ["*"], ai: ["*"], ao: ["*"], ti: ["*"] },
      2: { ni: ["*"], no: ["*"], ai: ["*"], ao: ["*"], ti: ["*"] },
      3: { ni: ["*"], no: ["*"], ai: ["*"], ao: ["*"], ti: ["*"] },
      4: { ni: ["*"], no: ["*"], ai: ["*"], ao: ["*"], ti: ["*"] },
    }; */
    for (const item of dataset) {
      const grp = item.group;
      const tag = item.tag;
      const niNbs = prv[item.id]["ni"];
      const noNbs = prv[item.id]["no"];
      const aiNbs = prv[item.id]["ai"];
      const aoNbs = prv[item.id]["ao"];
      const tiNbs = prv[item.id]["ti"];
      for (const [key, value] of Object.entries(structure)) {
        if (key === grp) {
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
        }
      }
    }
    return structure;
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
      for (let i = 0; i < prs[key]; i++) {
        value.unshift(name);
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
  // Method wich return empty List //
  list() {
    const _list = [];
    _list.length = 0;
    return _list;
  }
  // Method which build the main IOList project (raw) //
  rawList() {
    const dictionnary = this.dataset;
    const size = Object.keys(dictionnary).length;
    let niNbs = 0;
    let noNbs = 0;
    let aiNbs = 0;
    let aoNbs = 0;
    let tiNbs = 0;
    for (let i = 1; i < size + 1; i++) {
      niNbs += dictionnary[i]["ni"].length;
      noNbs += dictionnary[i]["no"].length;
      aiNbs += dictionnary[i]["ai"].length;
      aoNbs += dictionnary[i]["ao"].length;
      tiNbs += dictionnary[i]["ti"].length;
    }
    return { ni: niNbs, no: noNbs, ai: aiNbs, ao: aoNbs, ti: tiNbs };
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
