import {SET_CURSOS_DETAILS, SET_CURSOS_MODULO, SET_CURSOS_MATERIAL} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  courseDetails: [],
  courseModules: [],
  courseTools: [],
  coursoModulo: [],
  coursoMaterial: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CURSOS_DETAILS:
    return {
      ...state,
      ...action.content
    };
  case SET_CURSOS_MODULO:
    return {
      ...state,
      ...action.content
    };
  case SET_CURSOS_MATERIAL:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}