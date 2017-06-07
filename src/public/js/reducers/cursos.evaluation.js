import {SET_CURSOS_EVALUATION} from "../actions/types";

const INITIAL_STATE = {
  courseEvaluation: [],
  questions: []
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
  case SET_CURSOS_EVALUATION:
    return {
      ...state,
      ...action.content
    };
  default:
    return state;
  }

}