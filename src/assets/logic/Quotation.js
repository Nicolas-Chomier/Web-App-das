import { DocumentTools, Proface } from "./Toolbox";

export function handleClick_Quotation(rawAbstract) {
  // ................................................................................ test
  // Build basical datas needed for document construction (methods are imported from mainDataBuilder):
  const resultats = new DocumentTools(rawAbstract).reservedDictionnary();
  console.log("resultats de l'architecture", resultats);
  //
  const liste = new DocumentTools(rawAbstract).mainList(resultats);
  console.log("resultats de l'IO Liste", liste);
  //
  const addedListe = new DocumentTools(rawAbstract).ioListAdder(liste);
  console.log("addedListe", addedListe);
  //
  const mod1 = new Proface(liste[1]).totalModule();
  const mod2 = new Proface(liste[2]).totalModule();
  const mod3 = new Proface(liste[3]).totalModule();
  console.log("modules1", mod1);
  console.log("modules2", mod2);
  console.log("modules3", mod3);
  //
  const proj = new DocumentTools(rawAbstract).nomenclatureModule(mod1);
  console.log(proj);

  // ................................................................................
}
