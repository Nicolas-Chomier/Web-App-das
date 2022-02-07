import { Packer } from "docx";
import { saveAs } from "file-saver";
import { DataBuilder, Proface, DocxBuilder } from "../tools/DocumentBuilder";
import { Document } from "docx";
// Elements for document presentation
import { header } from "../tools/DocumentHeader";
import { footer } from "../tools/DocumentFooter";
// External datas importation
import language from "../data/language.json";

export function handleClick_Architecture(rawAbstract, tongue) {
  // Load and parse special datas from JSON
  const choosenLanguage = JSON.parse(JSON.stringify(language));
  // Document text language settings
  const speak = choosenLanguage["architecture"][tongue === 0 ? "uk" : "fr"];
  // Instantiation for all class needed (Data builder, Document builder, Technology Provider)
  const Dt = new DataBuilder(rawAbstract);
  const Dx = new DocxBuilder(rawAbstract);
  const Tp = new Proface(rawAbstract);
  // Build basical dataset, MASTER => iolist dictionnary, MASTER2 => tagList dictionnary
  const MASTER_IO = Dt.addMandatorySlotTofullIolistProject();
  const MASTER_TAG = Dt.tagListObject();
  // Get project title
  const projectTitle = Dx.buildTitle();
  return false;
}
