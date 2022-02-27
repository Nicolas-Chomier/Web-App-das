import proface from "../../data/proface.json";

class MainToolsBox {
  constructor(rawAbstract) {
    this.proface = JSON.parse(JSON.stringify(proface));
    this.hmiId = rawAbstract.Project.Technology.id;
    this.emptyIoListModel = { DI: 0, DO: 0, AI: 0, AO: 0, AIt: 0 };
  }
}
/** */
export class QTSBuilder extends MainToolsBox {
  plcNativeIoList() {
    const nativIo = this.proface["PROFACE"][this.hmiId]["NativeIO"];
    return nativIo;
  }
  nomenclatureForHmi(source) {
    const typeOfPlc = this.plcNativeIoList();
    const conceptionList =
      typeOfPlc === false ? ["HMI", "PLC", "CAN"] : ["HMI"];
    const table = [...source];
    for (const item of conceptionList) {
      const _list = [];
      _list.push(item);
      _list.push(this.proface.PROFACE[this.hmiId][item]["Denomination"]);
      _list.push(this.proface.PROFACE[this.hmiId][item]["Ref"]);
      _list.push("1");
      table.push(_list);
    }
    return table;
  }
  nomenclatureForModule(source, moduleList) {
    const table = [...source];
    for (const [key, value] of Object.entries(moduleList)) {
      if (value !== 0) {
        const rows = [];
        rows.push(this.proface.PROFACE[key]["Reference"]);
        rows.push(this.proface.PROFACE[key]["Manufacturer"]);
        rows.push(this.proface.PROFACE[key]["Description"]);
        rows.push(`${value}`);
        table.push(rows);
      }
    }
    return table;
  }
  // Method which add all module number in one module line up
  uniqueIoList(obj = {}) {
    var size = Object.keys(obj).length;
    if (size !== 0) {
      const list = [];
      for (const value of Object.values(obj)) {
        list.push(value);
      }
      const result = list.reduce((a, b) => {
        for (let k in b) {
          if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
        }
        return a;
      }, {});
      return result;
    }
    return this.emptyIoListModel;
  }
}
