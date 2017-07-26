import {combineReducers} from "redux";
import auth from "./auth";
import modal from "./modal";
import footer from "./footer";
import aboutus from "./aboutus";
import contactus from "./contactus";
import faq from "./faq";
import calendario from "./calendario";
import cursos from "./cursos";
import cursosDetails from "./cursos.details";
import cursosTutorials from "./cursos.tutorials";
import cursosEvaluation from "./cursos.evaluation";
import herramientas from "./herramientas";
import profile from "./myprofile";
import home from "./home";

const rootReducer = combineReducers({
  modal,
  footer,
  auth,
  aboutus,
  contactus,
  faq,
  calendario,
  cursos,
  cursosDetails,
  cursosTutorials,
  cursosEvaluation,
  herramientas,
  profile,
  home
});

export default rootReducer;