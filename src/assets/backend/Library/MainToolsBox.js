import proface from "../../data/proface.json";

const profaceDatas = JSON.parse(JSON.stringify(proface));

class MainToolsBox {
  constructor(rawAbstract) {
    this.infosElement = rawAbstract.Elements;
    this.hmiId = rawAbstract.Project.Technology.id;
    this.emptyIoListModel = { DI: 0, DO: 0, AI: 0, AO: 0, AIt: 0 };
    this.projectTitle = rawAbstract.Project.Title;
    this.coef = rawAbstract.Project.Coef;
    this.openAir = rawAbstract.Project.OpenAir;
    this.HMI_id = rawAbstract.Project.Technology.id;
    this.native = rawAbstract.Project.Technology.nativeDevice;
  }
}
/** */
export class QTSBuilder extends MainToolsBox {
  plcNativeIoList() {
    const nativIo = profaceDatas.PROFACE[this.hmiId]["NativeIO"];
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
      _list.push(profaceDatas.PROFACE[this.hmiId][item]["Denomination"]);
      _list.push(profaceDatas.PROFACE[this.hmiId][item]["Ref"]);
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
        rows.push(profaceDatas.PROFACE[key]["Reference"]);
        rows.push(profaceDatas.PROFACE[key]["Manufacturer"]);
        rows.push(profaceDatas.PROFACE[key]["Description"]);
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
/** */
export class AFBuilder extends MainToolsBox {
  nativeDeviceInfos() {
    const bool = typeof this.native === "boolean" ? this.native : false;
    return bool;
  }
  choosenDeviceReference(type, bool) {
    const ref = profaceDatas.PROFACE[this.hmiId][type]["Ref"];
    return bool ? ref.toUpperCase() : ref;
  }
  /** */
  editedDeviceInformations(type) {
    const Den = profaceDatas.PROFACE[this.hmiId][type].Denomination;
    const Ref = profaceDatas.PROFACE[this.hmiId][type].Ref;
    const Dev = profaceDatas.PROFACE[this.hmiId][type].Devices;
    const intro = `${Den}(${Ref}) with:`;
    return [intro, Dev];
  }
}
