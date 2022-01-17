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
    const dataset = this.data_elements;
    // Open air identifacation flag & number:
    const flag = "OPA";
    let j = 1;
    for (const item of dataset) {
      const name = item.name;
      const grp = item.group;
      for (const [key, value] of Object.entries(structure)) {
        // For each group ...
        if (key === grp) {
          // If open air compressors are present in wish list or not:
          if (name !== flag) {
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
  constructor(rawAbstract) {
    // Incertitude coeficient
    this.coef = rawAbstract.Project.Coef;
  }
  // Method wich return empty Object //
  object() {
    const _obj = {};
    for (const prop of Object.getOwnPropertyNames(_obj)) {
      delete _obj[prop];
    }
    return _obj;
  }
  // Method which build the main IOList project //
  mainList(dictionnary) {
    // Get number of groups
    const size = Object.keys(dictionnary).length;
    // Create an empty object
    const _result = this.object();
    // For each group ...
    for (let i = 1; i < size + 1; i++) {
      // for each type of device (ni, no ...) ...
      for (const key of Object.keys(dictionnary[i])) {
        if (
          key === "ni" ||
          key === "no" ||
          key === "ai" ||
          key === "ao" ||
          key === "ti"
        ) {
          // Build item IOList
          const _obj = { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 };
          for (const akey of Object.keys(_obj)) {
            // Incertitude coef are always apply, take care to not use reserved dictionnary !
            _obj[akey] += Math.round(dictionnary[i][akey].length * this.coef);
            _result[i] = _obj;
          }
        } else {
          // Build CP (compressor) IOList
          const _obj = { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 };
          for (const bkey of Object.keys(_obj)) {
            _obj[bkey] += dictionnary[i][key][bkey].length;
            _result[i][key] = _obj;
          }
        }
      }
    }
    return _result;
  }
}

// Class wich build special module and technical data like IO board (only with PROFACE)
export class Proface {
  constructor(iolist) {
    // Shape of IOList needed { ni: *, no: *, ai: *, ao: *, ti: * }
    this.IOList = { ...iolist };
    // Build specific supplier datas:
    this._results = {
      module1: 0,
      module2: 0,
      module3: 0,
      module4: 0,
      module5: 0,
      module6: 0,
      module7: 0,
      module8: 0,
      module9: 0,
      module10: 0,
      module11: 0,
      module12: 0,
    };
    this.nMax = 16; // Maximum numerical input / output module capacity
    this.nMid = 8; // Middle size numerical input / output module capacity
    this.nMin = 4; // Minimum numerical input / output module capacity
    this.aMax = 8; // Maximum numerical input / output module capacity
    this.aMid = 4; // Middle size numerical input / output module capacity
    this.aMin = 2; // Minimum numerical input / output module capacity
    this.temp = 4; // Size for temperature analog input capacity
    this.sMax = 14; // Maximum module capacity by rack
  }
  // Method wich calcul the numbers of numerical proface module selection according given IOList //
  numericalModule() {
    let ni = this.IOList.ni;
    let ri = ni % this.nMax;
    let no = this.IOList.no;
    let ro = no % this.nMax;
    let _output = 0;
    // Numerical Input Filling :
    this._results.module1 += Math.floor(ni / this.nMax);
    if (ri !== 0) {
      if (ri > this.nMid) {
        this._results.module1 += 1;
      } else if (ri > this.nMin && ri <= this.nMid) {
        this._results.module2 += 1;
      } else {
        this._results.module5 += 1;
        _output += 4;
      }
    }
    // Correction on numerical output :
    no -= 4 * Math.floor(_output / this.nMin);
    // Numerical Output Filling :
    this._results.module3 += Math.floor(no / this.nMax);
    if (ro !== 0) {
      if (ro > this.nMid) {
        this._results.module3 += 1;
      } else if (ro > this.nMin && ro <= this.nMid) {
        this._results.module4 += 1;
      } else {
        this._results.module5 += 1;
      }
    }
    return true;
  }
  // Method wich calcul the numbers of analog proface module selection according given IOList //
  analogModule() {
    let ai = this.IOList.ai;
    let ao = this.IOList.ao;
    let ti = this.IOList.ti;
    let ri = ai % this.nMax;
    let ro = ao % this.nMax;
    let _input = 0;
    let _output = 0;
    // Analog Input Filling :
    this._results.module6 += Math.floor(ai / this.aMax);
    if (ri !== 0) {
      if (ri > this.aMid) {
        this._results.module6 += 1;
        _input += this.aMax - ri;
      } else {
        this._results.module9 += 1;
        _input += this.aMid - ri;
        _output += this.aMin;
      }
    }
    // Analog Temperature Input Filling :
    this._results.module7 += Math.floor(ti / this.temp);
    if (ti !== 0) {
      this._results.module7 += 1;
    }
    // Analog Output Filling :
    this._results.module8 += Math.floor(ao / this.aMax);
    if (ro !== 0) {
      if (ro > this.aMin) {
        this._results.module8 += 1;
        _output += this.aMax - ro;
      } else {
        this._results.module9 += 1;
        _output += this.aMin - ro;
        _input += this.aMid;
      }
    }
    // Correction :
    if (_input === this.aMid && _output === this.aMin) {
      this._results.module9 -= 1;
    }
    return true;
  }
  // Method wich return entire proface module nomenclature //
  totalModule() {
    this.numericalModule();
    this.analogModule();
    let totalModules = 0;
    for (const value of Object.values(this._results)) {
      totalModules += value;
    }
    console.log("totalModules", totalModules);
    var restModule = totalModules % this.sMax;
    console.log("restModule", restModule);
    if (restModule > 0) {
      console.log("restmodule plus grand que 0");
      if (restModule <= 7) {
        console.log("restmodule plus <= 7");
        this._results.module10 += Math.floor(totalModules / this.sMax) + 1;
        this._results.module11 += Math.floor(totalModules / this.sMax);
        this._results.module12 += Math.floor(totalModules / this.sMax);
      } else {
        console.log("restmodule plus grand que 7");
        this._results.module10 += Math.floor(totalModules / this.sMax) + 1;
        this._results.module11 += Math.floor(totalModules / this.sMax) + 1;
        this._results.module12 += Math.floor(totalModules / this.sMax) + 1;
      }
    } else {
      return this._results;
    }
    return this._results;
  }
}