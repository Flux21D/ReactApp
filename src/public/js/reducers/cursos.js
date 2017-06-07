import {SET_CURSOS, SET_FAV_CURSOS, SET_PROFILE_CURSOS_DETAILS} from "../actions/types";

const INITIAL_STATE = {
  bannerContent: {},
  courses: [],
  searchParams: {},
  totalCoursesCount: 1,
  activePageNo: 1,
  favCursos: {},
  coursoDetailObj: {}
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CURSOS:
    return {
      ...state,
      ...action.content
    };
  case SET_FAV_CURSOS:
    return {
      ...state,
      ...action.content
    };
  case SET_PROFILE_CURSOS_DETAILS:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}