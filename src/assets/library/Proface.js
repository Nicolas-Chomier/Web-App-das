// Class which build special module and technical data like IO board (only with PROFACE)
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
    // Empty lineUp (to chnage if we work whith other module)
    this.emptyLineUp = {
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
    this.stationHeadMod = "module10";
    this.newOrder = [
      "module10",
      "module1",
      "module2",
      "module3",
      "module4",
      "module5",
      "module6",
      "module7",
      "module8",
      "module9",
      "module11",
      "module12",
    ];
  }
  // Method which give module which have to be avoid when we construct IOList document
  dropNoModule() {
    const undisplayableModuleList = [...this.mSpe];
    //return forbiden module list without module head station
    undisplayableModuleList.shift();
    return undisplayableModuleList;
  }
  // Method which give empty line up (most secure to manage here)
  dropEmptyLineUp() {
    return this.emptyLineUp;
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
  getModuleList(IOList) {
    // Shape of IOList needed { DI: *, DO: *, AI: *, AO: *, AIt: * }
    const moduleList = {
      ...this.numericalModule(IOList),
      ...this.analogModule(IOList),
    };
    const specialModule = this.totalModule(moduleList);
    const finalResult = { ...moduleList, ...specialModule };
    // Change module list oreder to have module station head in first
    const data = this.preferredOrder(finalResult, this.newOrder);
    return data;
  }
  // Method which transform IOList to clean and ordered line up module lists (using method below)
  GetlineUp(IOList) {
    // Check if IOList is empty
    const isEmpty = !Object.values(IOList).some((x) => x !== 0);
    if (isEmpty !== true) {
      // Step 1 : build raw line up module
      const raw = this.getModuleList(IOList);
      console.log("raw", raw);
      // Step 2 : Work on raw
      const filteredRaw = this.designModuleLine(raw);
      const splitedLineUp = this.splitModuleLine(filteredRaw);
      const orderedLineUp = this.orderedModuleLine(splitedLineUp);
      // Step 3 : return it
      return orderedLineUp;
    }
    return false;
  }
  // Method wich return a list with raw module line without special module (run only with GetlineUp method)
  designModuleLine(moduleLine) {
    const _list = [];
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
  // Method which build group of list of module line according PROFACE specificity (run only with GetlineUp method)
  splitModuleLine(table) {
    const _list = [];
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
  // Method which add and order special module from matrix (parameter given by splitModuleLine), according PROFACE specificity (run only with GetlineUp method)
  orderedModuleLine(matrix) {
    const _list = [];
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
  // Method which give all info about choosen HMI
  giveMeHmiInformations(id, target) {
    return this.proface.PROFACE[id][target];
  }
  // Method which swap elment in js obj according order list
  preferredOrder(obj, order) {
    const newObject = {};
    for (let i = 0; i < order.length; i++) {
      if (obj.hasOwnProperty(order[i])) {
        newObject[order[i]] = obj[order[i]];
      }
    }
    return newObject;
  }
}
