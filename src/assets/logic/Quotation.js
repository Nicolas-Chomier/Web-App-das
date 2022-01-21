import { DocumentTools, Proface } from "./Toolbox";

export function handleClick_Quotation(rawAbstract) {
  // Instantiation of the Document Tools class
  const Dt = new DocumentTools(rawAbstract);
  // Instantiation of the Technology Provider (PROFACE) class
  const Tp = new Proface();
  // Build tag architecture
  const tagArch = Dt.dictionnaryWithTag();
  console.log("Resultats de l'architecture (avec TAG)", tagArch);
  // Build fully main IOList
  const fullIOlist = Dt.ioListBuilder();
  console.log("Fully main IO List => ", fullIOlist);
  // Build main module line
  const mod1 = Tp.totalModule(fullIOlist);
  console.log("All TM3 project Module", mod1);
  // Build open air compressor module line
  const mod2 = Dt.openAirModule();
  console.log("Module TM3 des compresseurs open air", mod2);
  // Merge this two module line up
  const mergedModules = Dt.mergeModuleLine(mod1, mod2);
  console.log("Resultat apres la fusion des listes de module", mergedModules);
  // Build general module nomenclature
  const elementsNomenclature = Dt.nomenclatureModule(mergedModules);
  console.log("Nomenclature des elements", elementsNomenclature);
}
